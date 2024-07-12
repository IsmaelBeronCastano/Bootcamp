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

