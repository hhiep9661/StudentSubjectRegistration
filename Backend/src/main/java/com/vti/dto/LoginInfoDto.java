package com.vti.dto;

public class LoginInfoDto {
	private short id;

	private String fullName;
	
	private String status;

	

	public LoginInfoDto(short id, String fullName, String status) {
		super();
		this.id = id;
		this.fullName = fullName;
		this.status = status;
	}

	public short getId() {
		return id;
	}

	public String getFullName() {
		return fullName;
	}

	public String getStatus() {
		return status;
	}


}
