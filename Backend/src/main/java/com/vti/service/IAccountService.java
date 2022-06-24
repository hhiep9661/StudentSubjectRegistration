package com.vti.service;

import java.util.List;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.vti.entity.Account;
import com.vti.form.AccountFormForCreating;
import com.vti.form.AccountFormForCreatingRegister;
import com.vti.form.AccountFormForUpdating;

public interface IAccountService extends UserDetailsService{

	public Page<Account> getAllAccounts(Pageable pageable, String search);

	public Account getAccounttByID(short id);

	public void deleteAccountByID(short id);

	public void createAccount(AccountFormForCreating form);

	public void updateAccount(short id, AccountFormForUpdating form);
	
	public Account getAccountByUsername(String username);

	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException;

	public boolean existsByUsername(String username);

	public boolean existsByEmail(String email);

	public void deleteAccounts(List<Short> ids);

	public void createAccountRegister(AccountFormForCreatingRegister form);

	public void activeUser(String token);

	public Account getAccountByEmail(String email);




}
