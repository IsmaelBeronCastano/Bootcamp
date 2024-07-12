# 02 SPRING BOOT - Hibernate/JPA

## Setting up database scripts

- 1. Create a new MySQL user for our app
  - user id: springstudent, password: springstudent
- 2. Create a new database table: student
  - id INT
  - first_name VARCHAR(45)
  - last_name VARCHAR(45)
  - email VARCHAR(45)

~~~sql
DROP USER if exists 'springstudent'@'localhost';
             /*id*/                                       /*password*/
CREATE USER 'springstudent'@'localhost' IDENTIFIED BY 'springstudent';

GRANT ALL PRIVILEGES ON * . * TO 'springstudent'@'localhost';
~~~

- Now I have this user (you can see it in users and privileges)
- Create a new connection
  - name: springstudent
  - user: springstudent
- Test the connection & put the password springstudent
- Click OK
- The second script

~~~sql
CREATE DATABASE IF NOT EXISTS `student_tracker`;
USE `student_tracker`;

DROP TABLE IF EXISTS `student`;

CREATE TABLE `student` (
    `id` int NOT NULL AUTO_INCREMENT,
    `first_name` varchar(45) DEFAULT NULL,
    `last_name` varchar(45) DEFAULT NULL,
    `email` varchar(45) DEFAULT NULL,
	 PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
~~~
----

## Setting up Spring Boot project

- Hibernate is the default implementation of JPA
- EntityManager is from Jakarta Persistence API (JPA)
- We gonna use start.spring.io
- The dependencies we gonna add are:
  - MySQL driver: mysql-connector-j
  - JPA (ORM): spring-boot-starter-data-jpa
- In application.properties we gonna configure the url, username and password

~~~
spring.datasource.url=jdbc:mysql://localhost:3306/student_tracker
spring.datasource.username=springstudent
spring.datasource.password=springstudent
~~~

- No need to give JDBC driver class name (Spring will do it automatically)
-----

## Start Project

- CommandLineRunner is from Spring Boot Framework, executed after the Spring Beans have been loaded
  
~~~java
package com.meikakuzen.crudDemo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CrudDemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(CrudDemoApplication.class, args);
	}

	@Bean
	public CommandLineRunner commandLineRunner(String[] args ){
			
      //lambda expression
      return runner ->{  
				System.out.println("Hello world!");
			};
	}

}
~~~

- Configure application.properties

~~~
spring.datasource.url=jdbc:mysql://localhost:3306/student_tracker
spring.datasource.username=springstudent
spring.datasource.password=springstudent

# Turn off the spring boot banner in the command line
spring.main.banner-mode=off

# Reduce loggin level (only show warning and errors)
logging.level.root=warn
~~~

- I can see in the command line that the connection is done and my "hello world!"
- The application stops at the end
----

## JPA Develpment process

- TODO List
  - Anotate Java class
  - Develop Java Code to perform database operations
- Hibernate is the default implementation for JPA, so we gona use the therm JPA for both
- **Entity class** is a Java class mapped to a database table. 
  - Must be annotated with @Entity 
  - Must have a public or protected no-argument constructor (if you don't declare any constructor, Java will provide a no-argument constructor)
    - The class can have other constructors.
    - If you define a constructor with args, ypu must define a constructor with no args
 - Map class to a database table

~~~java
@Entity
@Table(name="student")
public class Student{

  @Id
  @GeneratedValue(strategy=GenerationType.IDENTITY) 
  @Column(name="id")
  private int id;

  @Column(name="first_name")
  private String firstName;
  
}
~~~

- Primary Key uniquely identifies each row in a table
- Must be a unique value and cannot contain null values
- We can define that is auto-increment
- Are diferent **GenerationTypes**
  - GenerationType.AUTO = Pick an appropiate strategy for the particular database
  - GenerationType.IDENTITY = Assign primary keys using database identity column **(RECOMMENDED)**
  - GenerationType.SEQUENCE = Assign primary keys using a database sequence
  - GenerationType.TABLE = Assign primary keys using an underlying database table to ensure uniqueness
- You can define you **custom strategy** to generate id's
- Create an implementation of **org.hibernate.id.IdentifierGenerator**
- Override the method **public Serializable generate()**
-----

## JPA coding

- Create a new package in the principal called com.meikakuze.cruddemo.entity
- Create a class called Student
- Define a constructor with no args, and other with the fields
- **Generate getters and setters**
- **Generate toString() method**

~~~java
package com.meikakuzen.crudDemo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="Student")
public class Student {
    
  @Id
  @GeneratedValue(strategy=GenerationType.IDENTITY) 
  @Column(name="id")
  private int id;

  @Column(name="first_name")
  private String firstName;

  @Column(name="last_name")
  private String lastName;

  @Column(name="email")
  private String email;

  public Student(){

  }

    public Student(String firstName, String lastName, String email){
    this.firstName = firstName;
    this.lastName= lastName;
    this.email= email;
    }

    //getters & setters
    public int getId() {
        return this.id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getFirstName() {
        return this.firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public String toString() {
        return "{" +
            " id='" + getId() + "'" +
            ", firstName='" + getFirstName() + "'" +
            ", lastName='" + getLastName() + "'" +
            ", email='" + getEmail() + "'" +
            "}";
    }  
}
~~~
---------

## Saving a Java object with JPA

- Let's go with the CRUD of Student!
- Student Data Acces Object (DAO) is responsible for interfacing with database
- We have diferent kind of methods
  - save
  - findById
  - findAll
  - findByLastName
  - update
  - delete
  - deleteAll
- Our DAO needs a JPA Entity Manager, and the JPA Entity Manager needs a Data Source
- The Data Source defines database connection info
- JPA ENtity and Data Source are automatically created by Spring Boot
  - Based on the file application.properties
- We can autowire/inject the JPA Entity Manager into our Student DAO
- **Steps:**
  - Define DAO interface
  - Define DAO implementation (inject the Entity Manager)
  - Update main app
- **Define DAO interface**

~~~java
public interface StudentDAO{
  void save(Student theStudent);
}
~~~

- **Define DAO implementation**

~~~java
@Repository
public class StudentDAOImpl implements StudentDAO{

  private EntityManager entityManager;

  @Autowired
  public StudentDaoImpl(EntityManager theEntityManager){
    entityManager = theEntityManager; //inject the Entity Manager
  }


  @Override
  @Transactional
  public void save(Student theStudent){
    entityManager.persist(theStudent); //save the Java Object
  }
}
~~~

- **@Transactional** is provided by Spring to *automagically* begin and end a transaction for your JPA code
- **@Repository** is a sub annotation of **@Component**
  - It's a specialized annotation for repositories
  - Spring will automatuically register the DAO implementation, thanks to component-scanning
  - Translates JDBC exceptions
- **Update main app**

~~~java
@SpringBootApplication
public class CrudDemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(CrudDemoApplication.class, args);
	}

	@Bean                                      //inject the StudentDAO
	public CommandLineRunner commandLineRunner(StudentDAO studentDAO){
			
    
      return runner ->{  
				createStudent(studentDAO); //call the method
			};
	}


  private void createStudent(StudentDAO studentDAO){

    Student tempStudent = new Student("Pep", "Leverkusen", "pep@gmail.com");

    studentDAO.save(tempStudent); 
  }
}
~~~

## Saving a Java Object with JPA - Coding

- Create a new package dao
- Create an interface called StudentDAO

~~~java
package com.meikakuzen.crudDemo.dao;

import com.meikakuzen.crudDemo.entity.Student;

public interface StudentDAO {
    void save(Student theStudent);
}
~~~

- Define DAO implementation
- Create a new class StudentDAOImpl

~~~java
package com.meikakuzen.crudDemo.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.meikakuzen.crudDemo.entity.Student;

import jakarta.persistence.EntityManager;

@Repository
public class StudentDAOImpl implements StudentDAO{
    
    private EntityManager entityManager;

    public StudentDAOImpl(){}

    @Autowired
    public StudentDAOImpl(EntityManager entityManager){
        this.entityManager = entityManager;
    }
    
    @Override
    @Transactional
    public void save(Student theStudent){
        entityManager.persist(theStudent);
    }
}
~~~

- Update main app
- Inject StudentDAO

~~~java
package com.meikakuzen.crudDemo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;

import com.meikakuzen.crudDemo.dao.StudentDAO;
import com.meikakuzen.crudDemo.entity.Student;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CrudDemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(CrudDemoApplication.class, args);
	}

	@Bean
	public CommandLineRunner commandLineRunner(StudentDAO studentDAO){
			return runner ->{ 
				createStudent(studentDAO);
			};
	}

	private void createStudent(StudentDAO studentDAO){
		Student tempStudent = new Student("Pep", "Jenkins", "pep@gmail.com");

		studentDAO.save(tempStudent);

		//display id
		System.out.println("The id is" + tempStudent.getId());
	}

}
~~~
----

## Primary Keys

- 




