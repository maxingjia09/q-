package com.outdoorclub.controller;

import com.outdoorclub.common.Result;
import com.outdoorclub.entity.UserActivity;
import com.outdoorclub.service.UserActivityService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user-activity")
@Api(tags = "用户活动管理")
public class UserActivityController {

    @Autowired
    private UserActivityService userActivityService;

    @PostMapping("/join")
    @ApiOperation("报名活动")
    public Result<UserActivity> joinActivity(
            @RequestParam Integer userId,
            @RequestParam Integer activityId,
            @RequestParam Integer clubId,
            @RequestParam String formData) {
        UserActivity userActivity = userActivityService.joinActivity(userId, activityId, clubId, formData);
        return Result.success(userActivity);
    }

    @GetMapping("/user/list")
    @ApiOperation("获取用户活动列表")
    public Result<List<UserActivity>> getUserActivityList(@RequestParam Integer userId) {
        List<UserActivity> userActivities = userActivityService.list(
                com.baomidou.mybatisplus.core.conditions.query.QueryWrapper.<UserActivity>lambdaQuery()
                        .eq(UserActivity::getUserId, userId)
        );
        return Result.success(userActivities);
    }

    @PostMapping("/update-status")
    @ApiOperation("更新活动状态")
    public Result<Boolean> updateActivityStatus(@RequestParam Integer id, @RequestParam String status) {
        boolean success = userActivityService.updateActivityStatus(id, status);
        if (success) {
            return Result.success(true);
        } else {
            return Result.error(500, "更新失败");
        }
    }
}
