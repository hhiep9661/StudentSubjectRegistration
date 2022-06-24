package com.vti.dto;

import com.vti.entity.Position.PositionName;

public class PositionDto {
	private short id;

	private String name;

	public PositionDto(short id, String name) {
		super();
		this.id = id;
		this.name = name;
	}

	public short getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	

	
	
}
