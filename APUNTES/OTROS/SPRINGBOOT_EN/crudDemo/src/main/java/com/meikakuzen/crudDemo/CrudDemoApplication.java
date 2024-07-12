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
