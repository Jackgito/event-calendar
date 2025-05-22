package com.calendar.calendar.repository;

import com.calendar.calendar.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends JpaRepository<User, Integer> {

        User findByUsername(String username);

}
