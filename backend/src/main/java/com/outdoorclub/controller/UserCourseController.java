package com.outdoorclub.controller;

import com.outdoorclub.common.Result;
import com.outdoorclub.entity.UserCourse;
import com.outdoorclub.service.UserCourseService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user-course")
@Api(tags = "用户课程管理")
public class UserCourseController {

    @Autowired
    private UserCourseService userCourseService;

    @PostMapping("/join")
    @ApiOperation("报名课程")
    public Result<UserCourse> joinCourse(
            @RequestParam Integer userId,
            @RequestParam Integer courseId,
            @RequestParam String formData) {
        UserCourse userCourse = userCourseService.joinCourse(userId, courseId, formData);
        return Result.success(userCourse);
    }

    @GetMapping("/user/list")
    @ApiOperation("获取用户课程列表")
    public Result<List<UserCourse>> getUserCourseList(@RequestParam Integer userId) {
        List<UserCourse> userCourses = userCourseService.list(
                com.baomidou.mybatisplus.core.conditions.query.QueryWrapper.<UserCourse>lambdaQuery()
                        .eq(UserCourse::getUserId, userId)
        );
        return Result.success(userCourses);
    }

    @PostMapping("/update-status")
    @ApiOperation("更新课程状态")
    public Result<Boolean> updateCourseStatus(@RequestParam Integer id, @RequestParam String status) {
        boolean success = userCourseService.updateCourseStatus(id, status);
        if (success) {
            return Result.success(true);
        } else {
            return Result.error(500, "更新失败");
        }
    }

    @PostMapping("/update-progress")
    @ApiOperation("更新学习进度")
    public Result<Boolean> updateProgress(@RequestParam Integer id, @RequestParam Integer progress) {
        boolean success = userCourseService.updateProgress(id, progress);
        if (success) {
            return Result.success(true);
        } else {
            return Result.error(500, "更新失败");
        }
    }
}
