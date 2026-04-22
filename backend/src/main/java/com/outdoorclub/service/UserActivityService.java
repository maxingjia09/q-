package com.outdoorclub.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.outdoorclub.entity.UserActivity;

public interface UserActivityService extends IService<UserActivity> {
    UserActivity joinActivity(Integer userId, Integer activityId, Integer clubId, String formData);
    boolean updateActivityStatus(Integer id, String status);
}
