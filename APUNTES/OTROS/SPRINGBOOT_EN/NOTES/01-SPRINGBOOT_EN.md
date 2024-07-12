# 01 SPRING BOOT 
## DEPENDENCY INJECTION


- STEPS:
  - STEP 1:
    - Define the dependency interface and class
    - The **@Component** makes the Spring bean avaliable for dependency injection
    - A Spring bean is a Java class that is managed by Spring
- Coach.java

~~~java
package com.example.springcoredemo;

public interface Coach{
    String getDailyWorkout();
}
~~~

- TennisCoach.java

~~~java
package com.example.springcoredemo;

import org.springframework.stereotype.Component;

@Component
public class TennisCoach implements Coach{
    
    @Override
    public String getDailyWorkout(){
        return "Practice smash 50 hours";
    }
}
~~~

- STEP 2:
  - Create REST Controller
- STEP 3:
  - Create a constructor in your class for injections
  - **@Autowired** tells Spring to inject a dependency
    - If you only have one constructor @Autowired is optional
- STEP 4:
  - Add @GetMapping for /dailyworkout
~~~java
package com.example.springcoredemo;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
public class DemoController{

    private Coach myCoach;

    @Autowired
    public DemoController(Coach TheCoach){
        myCoach = TheCoach;
    }

    @GetMapping("/dailyworkout")
    public String getDailyWorkout(){
        return myCoach.getDailyWorkout();
    }
}
~~~
------

## Component Scanning

- Default scanning is fine if everything is under com.example.springcoredemo
- For other packages I use a explicit list

~~~java
package com.example.springcoredemo;

@SpringBootApplication(
    scanBasePackages={"com.example.springcoredemo",
                      "com.code.util",
                      "com.acme.beepbeep"})
public class SpringCoreDemoApplication{

}
~~~

- Behind the scenes Spring Framework will do this for you: 
~~~java
Coach theCoach = new TennisCoach();
DemoController demoController = new DemoController();
~~~
----

## Setter Injection

- Is other type of injection (are constructor injection and setter injection)
- Inject dependencys by calling setter method(s) on your class
- STEPS:
  - Create setter method(s) in your class for injection
  - Configure the dependency injection with **@Autowired**

~~~java
@RestController
public class DemoController{

  private Coach myCoach;

  @Autowired
  public void setCoach(Coach theCoach){
    myCoach = theCoach;
  }
}
~~~

- Behind the scenes Spring Framework will do this for you: 

~~~java
Coach theCoach = new TennisCoach();
DemoController demoController = new DemoController();
demoController.setCoach(theCoach);
~~~

- Inject dependencies by calling ANY METHOD by using **@Autowired**
- Constructor injection is always the **first choice**
- Constructor injection for required dependencies, setter injection for optional dependencies
------

## Field Injection... no longer cool

- Not recomended by the Spring Team
- Makes the code harder to unit test
- Used on legacy projects 
- Field injection: inject dependencies by setting field values on your class directly (even private fields)
- Acomplished by using Java Reflection

~~~java
@RestController
public class DemoController{

  @Autowired
  private Coach myCoach;

    

    @GetMapping("/dailyworkout")
    public String getDailyWorkout(){
        return myCoach.getDailyWorkout();
    }
}
~~~

- No constructor, no setters. NOT RECOMMENDED
-------

## Qualifiers

- How Autowiring determine which Coach choose, if I have many Coaches (or classes that implements Coach)?
- By the way we did untill now, just with one Coach, there is no problem.
- But with more coaches, an error will happen (Paraeter 0 of a constructor)
- The solution: be specific! **@Qualifier**
- Specify the bean id: baseballCoach.
  - **Same name as class, first character lower-case**

~~~java
import org.springframework.beans.factory.annotation.Qualifier;

@RestController
public class DemoController{

    private Coach myCoach;

    @Autowired
    public DemoController(@Qualifier("baseballCoach") Coach TheCoach){
        myCoach = TheCoach;
    }

    @GetMapping("/dailyworkout")
    public String getDailyWorkout(){
        return myCoach.getDailyWorkout();
    }
}
~~~

- If you are using setter injection is the same

~~~java
@RestController
public class DemoController{

  private Coach myCoach;

  @Autowired
  public void setCoach(@Qualifier("basketballCoach") Coach theCoach){
    myCoach = theCoach;
  }

  @GetMapping("/dailyWorkout")
  public String getDailyWorkout(){
    return theCoach.getDailyWorkout();
  }
}
~~~

- Remember use the @Component in each coach class to tell Spring that is a Spring bean!
-----

## @Primary

- We can choose a primary implementation by using @Primary

~~~java
import org.springframework.context.annotation.Primary;

@Primary
@Component
public class TennisCoach implements Coach{
    
    @Override
    public String getDailyWorkout(){
        return "Practice smash 50 hours";
    }
}
~~~

- You don't need to use @Qualifier annotation in the controller if we use TennisCoach as implementation
- You can use just **only one** @Primary 
- You can mis @Primary and @Qualifier with any problem. @Qualifier has higher priority
-------

## Lazy Initialization

- By default all beans (Components,etc...) are initialized when Spring starts
- Spring will create an instance of each and make them avaliable
- We can specify lazy initialization with **@Lazy**

~~~java
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

@Component
@Lazy
public class TennisCoach implements Coach{
    
    @Override
    public String getDailyWorkout(){
        return "Practice smash 50 hours";
    }
}
~~~

- This bean will be only initializated if needed for dependency injection
- We can use lazy initialization in the global configuration with the file application.properties

> spring.main.lazy-initialization=true

- All beans are lazy, including our DemoController
- Once we access to endpoint/dailywork, Spring will do the work
----- 

## Bean Scopes

- The default scope is **singleton** (every instance point to the same instance)
- We have different scopes
  - Singleton (default scope)
  - Prototype: creates a new bean instance for each container request (each injection)
  - Request: Scoped to an HTTP web request. Only used for web apps
  - Session: Scoped to an HTTP web session. Only used for web apps
  - Global-session: Scoped to a global HTTP session. Only used for web apps
- **Prototype**
  - We have to specify the scope

~~~java
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public class CricketCoach implements Coach{

}
~~~

- Scope Example

~~~java
@RestController
public class DemoController{
  private Coach theCoach;
  private Coach anotherCoach;

  @Autowired
  public DemoController(
            @Qualifier("cricketCoach") Coach theCoach,
            @Qualifier("cricketCoach") Coach anotherCoach){

              this.theCoach = theCoach;
              this.anotherCoach = anotherCoach;
            }
}
~~~

- In Singleton Scope this will return true, in prototype scope will return false

~~~java
theCoach == anotherCoach
~~~
-----

## Bean Lifecycle methods / Hooks

- Container started - bean instantiated - Dependencies injected - Internal Spring Processing - Your Custom Init Method (bean is ready for use)
- When the container is shutdown - Your custom Destroy Method
- With **hooks** you can add custom code during bean initialization
- And during bean destruction too.
- Step by step
  - Define your methods for init and destroy
  - Add **@PostConstruct** and **@PreDestroy**

~~~java
@RestController
private classw DemoController{

  private Coach myCoach;

  @Autowired
  public DemoController(
    @Qualifier("cricketCoach") Coach myCoach
  ){
    this.myCoach = myCoach;
  }

  //init method

  @PostContruct
  public void myStartMethod(){
      System.out.println(getClass().getSimpleName());
  }

  //pre-destroy method

  @PreDestroy
  public void myCleanupMethod(){
      System.out.println(getClass().getSimpleName());
  }
}
~~~
----

## Configuring Beans with Java code

- Making an existing third-party class avaliable to Spring framework
- Real world project example: using AWS to store documents
- We want to use ASW S3 client as a Spring bean in our app
- We can´t modify the AWS SDK dource code
- We can just add a @Component and configure it as a Spring bean using **@Bean**

~~~java
import software.amazon.awssdk.auth.credentials.ProfileCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;


@Configuration
public class DocumentConfig{
  
  @Bean
  public S3Client remoteClient() {
    ProfileCredentilasProvider credentialsProvider = ProfileCredentialsProvider.create();
    Region region = Region.US_EAST_1;
    s3Clinet s3Client = S3Client.builder(
        .region(region)
        .credentilasProvider(credentialsProvider)
        .build();

        return s3Client;
    )
  }

}
~~~

- Now we can use it as a Spring bean and inject it

~~~java
import software.amazon.awssdk.services.s3.S3Client;

@Component
public class DocumentsService{
  
  private S3Client s3Client;

  @Autorewired
  public DocumentsService(S3client theS3Client){
    s3Client = theS3Client
  }

  public void processDocument(Document theDocument){

    //create a put request for the object
    PutObjectRequest putObjectRequest = PutObjectRequest.builder()
      .bucket(bucketName)
      .key(subDirectory + "/"+ fileName)
      .acl(ObjectCannedACL.BUCKET_OWNER_FULL_CONTROL).build();

      //perform putObject operation using our autowired bean
      s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(fileInputStream, contentLength))

  }

}
~~~

- Another example
- Create new class SwimCoach

~~~java
//note that I don't se @Component
public class SwimCoach implements Coach{
  @Override
  public String getDailyWorkout(){
    return "Swim, swim, swim";
  }
}
~~~

- I try to inject swimCoach in DemoController

~~~java
@RestController
public class DemoController{
  private Coach theCoach;


  @Autowired
  public DemoController(@Qualifier("swimCoach") Coach theCoach) {

              this.theCoach = theCoach;
            }
}
~~~

- It fails because can't find swimCoach cause doesn't have @Component
- I create a new class called SportConfig

~~~java
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Bean;

@Configuration
public class SportConfig{

  @Bean
  public Coach swimCoach(){ //the bean id defaults to the method name
    return new SwimCoach();
  }
}
~~~

- Now it works!
- I can give a custom id just like this

~~~java
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Bean;

@Configuration
public class SportConfig{

  @Bean("aquatic") //custom bean id
  public Coach swimCoach(){ 
    return new SwimCoach();
  }
}
~~~

- In the controller I use it

~~~java
@RestController
public class DemoController{
  private Coach theCoach;


  @Autowired
  public DemoController(@Qualifier("aquatic") Coach theCoach) {

              this.theCoach = theCoach;
            }
}
~~~
----

## 