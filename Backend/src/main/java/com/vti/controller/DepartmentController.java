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

import com.vti.dto.DepartmentDto;
import com.vti.entity.Department;
import com.vti.service.IDepartmentService;

@RestController
@RequestMapping(value = "api/v1/departments")
@CrossOrigin("*")
public class DepartmentController {
	@Autowired
	private IDepartmentService departmentService;
	
	@GetMapping
	public ResponseEntity<?> getAllDepartments() {
		List<Department> listDepartments = departmentService.getAllDepartments();

		List<DepartmentDto> lisDepartmentDtos = new ArrayList<>();

		for (Department department : listDepartments) {
			DepartmentDto departmentDto = new DepartmentDto(department.getId(), department.getName());
			lisDepartmentDtos.add(departmentDto);
		}
		return new ResponseEntity<>(lisDepartmentDtos, HttpStatus.OK);
	}
	
}
