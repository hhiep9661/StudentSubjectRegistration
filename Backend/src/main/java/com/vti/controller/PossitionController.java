package com.vti.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vti.dto.PositionDto;
import com.vti.entity.Position;
import com.vti.service.IPossitionService;

@RestController
@RequestMapping(value = "api/v1/positions")
@CrossOrigin("*")
public class PossitionController {
	@Autowired
	private IPossitionService possitionService;
	
	@GetMapping
	public ResponseEntity<?> getAllPositions() {
		List<Position> listPositions = possitionService.getAllPositions();

		
		List<PositionDto> listPositionDtos = new ArrayList<>();

		
for (Position position : listPositions) {
			PositionDto positionDto = new PositionDto(position.getId(), position.getName().toString());
			listPositionDtos.add(positionDto);
		}
		return new ResponseEntity<>(listPositionDtos, HttpStatus.OK);
	}
}
