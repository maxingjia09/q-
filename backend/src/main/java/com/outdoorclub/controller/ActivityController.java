package com.outdoorclub.controller;

import com.outdoorclub.common.Result;
import com.outdoorclub.entity.Activity;
import com.outdoorclub.service.ActivityService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/activity")
@Api(tags = "活动管理")
public class ActivityController {

    @Autowired
    private ActivityService activityService;

    @GetMapping("/list")
    @ApiOperation("获取活动列表")
    public Result<List<Activity>> getActivityList(@RequestParam(required = false) String type) {
        List<Activity> activities;
        if (type != null) {
            activities = activityService.list();
        } else {
            activities = activityService.list();
        }
        return Result.success(activities);
    }

    @GetMapping("/detail")
    @ApiOperation("获取活动详情")
    public Result<Activity> getActivityDetail(@RequestParam Integer id) {
        Activity activity = activityService.getActivityById(id);
        if (activity != null) {
            return Result.success(activity);
        } else {
            return Result.error(404, "活动不存在");
        }
    }

    @PostMapping("/create")
    @ApiOperation("创建活动")
    public Result<Activity> createActivity(@RequestBody Activity activity) {
        boolean saved = activityService.save(activity);
        if (saved) {
            return Result.success(activity);
        } else {
            return Result.error(500, "创建失败");
        }
    }

    @PostMapping("/update")
    @ApiOperation("更新活动")
    public Result<Activity> updateActivity(@RequestBody Activity activity) {
        boolean updated = activityService.updateById(activity);
        if (updated) {
            return Result.success(activityService.getById(activity.getId()));
        } else {
            return Result.error(500, "更新失败");
        }
    }

    @PostMapping("/delete")
    @ApiOperation("删除活动")
    public Result<Boolean> deleteActivity(@RequestParam Integer id) {
        boolean deleted = activityService.removeById(id);
        if (deleted) {
            return Result.success(true);
        } else {
            return Result.error(500, "删除失败");
        }
    }
}
