package com.vti.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

import com.vti.entity.Account;
import com.vti.entity.AccountStatus;
import com.vti.entity.RegistrationUserToken;
import com.vti.repository.IRegistrationUserTokenRepository;


@Component
public class EmailService implements  IEmailService {
	@Autowired
	private JavaMailSender mailSender;
	
	@Autowired
	private IAccountService accountService;

	@Autowired
	private IRegistrationUserTokenRepository registrationUserTokenRepository;


	@Override
	public void sendRegistrationUserConfirm(String email) {
		String subject = "Xác Nhận Đăng Ký Account";
		String content = "Bạn đã đăng ký thành công.";

//		 Tìm account từ email nhận được
		Account account = accountService.getAccountByEmail(email);

//		Tìm token lưu trong bảng registration_user_token dựa vào Account tìm được bên trên
		RegistrationUserToken registrationUserToken = registrationUserTokenRepository.getByAccount(account);
		String token = registrationUserToken.getToken();

//		String token = registrationUserTokenRepository.findByUserId(account.getId());
		String confirmationUrl = "http://localhost:8080/api/v1/accountsRegister/activeUser?token=" + token;
		content += " , hãy click vào đường link để active tài khoản: " + confirmationUrl;

		sendEmail(email, subject, content);



	}


	private void sendEmail(String email, String subject, String content) {
		SimpleMailMessage message = new SimpleMailMessage();
//		message.setFrom("system.vti.academy@gmail.com");
		message.setTo(email);
		message.setSubject(subject);
		message.setText(content);

		mailSender.send(message);

		
	}

}
