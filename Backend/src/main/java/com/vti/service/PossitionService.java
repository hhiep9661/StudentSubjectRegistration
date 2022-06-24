package com.vti.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vti.entity.Position;
import com.vti.repository.IPossitionRepository;

@Service
public class PossitionService implements IPossitionService{
	@Autowired
	private IPossitionRepository possitionRepository;
	
	@Override
	public List<Position> getAllPositions() {
		// TODO Auto-generated method stub
		return possitionRepository.findAll();
	}
}
