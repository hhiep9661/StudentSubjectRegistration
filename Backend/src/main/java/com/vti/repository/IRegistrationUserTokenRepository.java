package com.vti.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vti.entity.Account;
import com.vti.entity.RegistrationUserToken;

public interface IRegistrationUserTokenRepository extends JpaRepository<RegistrationUserToken, Integer>  {

	public RegistrationUserToken findByToken(String token);

	public RegistrationUserToken getByAccount(Account account);

}
