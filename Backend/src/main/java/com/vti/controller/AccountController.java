package com.vti.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.vti.dto.AccountDto;
import com.vti.entity.Account;
import com.vti.form.AccountFormForCreating;
import com.vti.form.AccountFormForUpdating;
import com.vti.service.IAccountService;

@RestController
@RequestMapping(value = "api/v1/accounts")
@CrossOrigin("*")
public class AccountController {
	@Autowired
	private IAccountService accountService;
	
	@GetMapping
	public ResponseEntity<?> getAllAccounts(Pageable pageable, @RequestParam(required = false) String search) {
		Page<Account> pageAccounts = accountService.getAllAccounts(pageable, search);

		// https://stackoverflow.com/questions/39036771/how-to-map-pageobjectentity-to-pageobjectdto-in-spring-data-rest
		Page<AccountDto> pageAccountDtos = pageAccounts.map(new Function<Account, AccountDto>() {
			@Override
			public AccountDto apply(Account account) {
				AccountDto accountDto = new AccountDto();
				accountDto.setId(account.getId());
				accountDto.setEmail(account.getEmail());
				accountDto.setUsername(account.getUsername());
				accountDto.setFullname(account.getFullname());
				accountDto.setDepartment(account.getDepartment().getName());
				accountDto.setPosition(account.getPosition().getName().toString());
				accountDto.setCreateDate(account.getCreateDate());
				return accountDto;
			}
		});
		return new ResponseEntity<>(pageAccountDtos, HttpStatus.OK);
	}
	
	@GetMapping(value = "/{id}")
	public ResponseEntity<?> getAccountByID(@PathVariable(name = "id") short id) {
		Account account = accountService.getAccounttByID(id);
		AccountDto accountDto = new AccountDto();
		accountDto.setId(account.getId());
		accountDto.setEmail(account.getEmail());
		accountDto.setUsername(account.getUsername());
		accountDto.setFullname(account.getFullname());
		accountDto.setDepartment(account.getDepartment().getName());
		accountDto.setPosition(account.getPosition().getName().toString());
		accountDto.setCreateDate(account.getCreateDate());
		return new ResponseEntity<>(accountDto, HttpStatus.OK);
	}
	
	@DeleteMapping(value = "/{id}")
	public ResponseEntity<?> deleteAccount(@PathVariable(name = "id") short id) {
		accountService.deleteAccountByID(id);
		return new ResponseEntity<String>("Delete successfully !!!", HttpStatus.OK);
	}
	
	@PostMapping
	public ResponseEntity<?> createAccount(@RequestBody AccountFormForCreating form) {
		accountService.createAccount(form);
		return new ResponseEntity<String>("Created successfully !!!", HttpStatus.CREATED);
		
	}
	
	@PutMapping(value = "/{id}")
	public ResponseEntity<?> updateAccount(@PathVariable(name = "id") short id, @RequestBody AccountFormForUpdating form) {
		accountService.updateAccount(id, form);
		return new ResponseEntity<String>("Update successfully!", HttpStatus.OK);
	}
	
	@GetMapping(value = "/UsernameExists/{username}")
	public ResponseEntity<?> existsByUsername(@PathVariable(name = "username") String username) {
		
		return new ResponseEntity<>(accountService.existsByUsername(username), HttpStatus.OK);
	}
	
	@GetMapping(value = "/EmailExists/{email}")
	public  ResponseEntity<?> existsByEmail(@PathVariable(name = "email") String email) {
		return new ResponseEntity<>(accountService.existsByEmail(email), HttpStatus.OK);
	}
	
	@DeleteMapping
	public ResponseEntity<?> deleteAccounts(@RequestParam(name = "ids") List<Short> ids) {
		accountService.deleteAccounts(ids);
		return new ResponseEntity<String>("Delete all successfully !!!", HttpStatus.OK);
	}

}
