package com.outdoorclub.controller;

import com.outdoorclub.common.Result;
import com.outdoorclub.entity.Course;
import com.outdoorclub.service.CourseService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/course")
@Api(tags = "课程管理")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @GetMapping("/list")
    @ApiOperation("获取课程列表")
    public Result<List<Course>> getCourseList(@RequestParam(required = false) String category) {
        List<Course> courses;
        if (category != null) {
            courses = courseService.list();
        } else {
            courses = courseService.list();
        }
        return Result.success(courses);
    }

    @GetMapping("/detail")
    @ApiOperation("获取课程详情")
    public Result<Course> getCourseDetail(@RequestParam Integer id) {
        Course course = courseService.getCourseById(id);
        if (course != null) {
            return Result.success(course);
        } else {
            return Result.error(404, "课程不存在");
        }
    }

    @PostMapping("/create")
    @ApiOperation("创建课程")
    public Result<Course> createCourse(@RequestBody Course course) {
        boolean saved = courseService.save(course);
        if (saved) {
            return Result.success(course);
        } else {
            return Result.error(500, "创建失败");
        }
    }

    @PostMapping("/update")
    @ApiOperation("更新课程")
    public Result<Course> updateCourse(@RequestBody Course course) {
        boolean updated = courseService.updateById(course);
        if (updated) {
            return Result.success(courseService.getById(course.getId()));
        } else {
            return Result.error(500, "更新失败");
        }
    }

    @PostMapping("/delete")
    @ApiOperation("删除课程")
    public Result<Boolean> deleteCourse(@RequestParam Integer id) {
        boolean deleted = courseService.removeById(id);
        if (deleted) {
            return Result.success(true);
        } else {
            return Result.error(500, "删除失败");
        }
    }
}
