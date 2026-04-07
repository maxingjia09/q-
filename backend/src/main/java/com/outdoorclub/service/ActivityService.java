package com.outdoorclub.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.outdoorclub.entity.Activity;

public interface ActivityService extends IService<Activity> {
    Activity getActivityById(Integer id);
    boolean updateParticipants(Integer activityId, Integer change);
}
