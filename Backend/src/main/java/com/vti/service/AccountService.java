package com.vti.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.vti.entity.Account;
import com.vti.entity.AccountStatus;
import com.vti.entity.Department;
import com.vti.entity.Position;
import com.vti.entity.RegistrationUserToken;
import com.vti.event.OnSendRegistrationUserConfirmViaEmailEvent;
import com.vti.form.AccountFormForCreating;
import com.vti.form.AccountFormForCreatingRegister;
import com.vti.form.AccountFormForUpdating;
import com.vti.repository.IAccountRepository;
import com.vti.repository.IDepartmentRepository;
import com.vti.repository.IPossitionRepository;
import com.vti.repository.IRegistrationUserTokenRepository;
import com.vti.specification.AccountSpecification;

@Service
@Transactional
public class AccountService implements IAccountService {
	@Autowired
	private IAccountRepository accountRepository;
	@Autowired
	private IDepartmentRepository departmentRepository;
	@Autowired
	private IPossitionRepository possitionRepository;

//	Using for encryption Password
	@Autowired
	private PasswordEncoder passwordEncoder;

	// Using for creating a token
	@Autowired
	private IRegistrationUserTokenRepository registrationUserTokenRepository;

	@Autowired
	private ApplicationEventPublisher eventPublisher;

	@Override
	public Page<Account> getAllAccounts(Pageable pageable, String search) {
		Specification<Account> where = null;
		if (!StringUtils.isEmpty(search)) {
			AccountSpecification nameSpecification = new AccountSpecification("fullname", "LIKE", search);
			AccountSpecification emailSpecification = new AccountSpecification("email", "LIKE", search);
			AccountSpecification departmentSpecification = new AccountSpecification("department.name", "LIKE", search);
			where = Specification.where(nameSpecification).or(emailSpecification).or(departmentSpecification);

		}
		return accountRepository.findAll(where, pageable);
	}

	@Override
	public Account getAccounttByID(short id) {
		// TODO Auto-generated method stub
		return accountRepository.findById(id).get();
	}

	@Override
	public void deleteAccountByID(short id) {
		accountRepository.deleteById(id);
		;

	}

	@Override
	public void createAccount(AccountFormForCreating form) {
		Account account = new Account();
		Department department = departmentRepository.getById(form.getDepartmentId());
		Position position = possitionRepository.getById(form.getPositionId());
		account.setEmail(form.getEmail());
		account.setUsername(form.getUsername());
		account.setFullname(form.getFullname());
		account.setDepartment(department);
		account.setPosition(position);
		accountRepository.save(account);

	}

	@Override
	public void updateAccount(short id, AccountFormForUpdating form) {
		Account accountUpdate = accountRepository.getById(id);
		Department department = departmentRepository.getById(form.getDepartmentId());
		Position position = possitionRepository.getById(form.getPositionId());
		accountUpdate.setFullname(form.getFullname());
		accountUpdate.setDepartment(department);
		accountUpdate.setPosition(position);
		accountRepository.save(accountUpdate);
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Account account = accountRepository.findByUsername(username);

		if (account == null) {
			throw new UsernameNotFoundException(username);
		}

		return new User(account.getUsername(), account.getPassword(), AuthorityUtils.createAuthorityList("user"));

	}

	@Override
	public Account getAccountByUsername(String username) {
		// TODO Auto-generated method stub
		return accountRepository.findByUsername(username);
	}

	@Override
	public boolean existsByUsername(String username) {
		// TODO Auto-generated method stub
		return accountRepository.existsByUsername(username);
	}

	@Override
	public boolean existsByEmail(String email) {
		// TODO Auto-generated method stub
		return accountRepository.existsByEmail(email);
	}

	@Override
	public void deleteAccounts(List<Short> ids) {
		accountRepository.deleteByIds(ids);

	}

	@Override
	public void createAccountRegister(AccountFormForCreatingRegister form) {
		// get data from frontend then save data to database
		Account account = new Account();
		Department department = departmentRepository.getById(form.getDepartmentId());
		Position position = possitionRepository.getById(form.getPositionId());
		account.setEmail(form.getEmail());
		account.setUsername(form.getUsername());
		account.setFullname(form.getFullname());
		account.setDepartment(department);
		account.setPosition(position);
		account.setPassword(passwordEncoder.encode(form.getPassword()));
		accountRepository.save(account);

		// create new user registration token
		createNewRegistrationUserToken(account);

		// send email to confirm
		sendConfirmUserRegistrationViaEmail(account.getEmail());

	}

	private void createNewRegistrationUserToken(Account account) {

		// create new token for confirm Registration
		final String newToken = UUID.randomUUID().toString();
		RegistrationUserToken token = new RegistrationUserToken(newToken, account);

		registrationUserTokenRepository.save(token);

	}

	private void sendConfirmUserRegistrationViaEmail(String email) {
		eventPublisher.publishEvent(new OnSendRegistrationUserConfirmViaEmailEvent(email));

	}

	@Override
	public void activeUser(String token) {
//		T??m l???i Token ??ang l??u tr??n DB d???a v??o th??ng tin token truy???n v???
		RegistrationUserToken registrationUserToken = registrationUserTokenRepository.findByToken(token);
//           T??m Account t????ng ???ng v???i Token nh???n ???????c
		Account account = registrationUserToken.getAccount();
//		Th???c hi???n Active account v???i Token t????ng ???ng
		account.setStatus(AccountStatus.ACTIVE);
		accountRepository.save(account);

		// X??a Token ??? b???ng Registration User Token sau khi ???? active
		registrationUserTokenRepository.deleteById(registrationUserToken.getId());


		
	}

	@Override
	public Account getAccountByEmail(String email) {
		// TODO Auto-generated method stub
		return accountRepository.findByEmail(email);
	}

}
