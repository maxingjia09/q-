package com.outdoorclub.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.outdoorclub.entity.Activity;
import com.outdoorclub.mapper.ActivityMapper;
import com.outdoorclub.service.ActivityService;
import org.springframework.stereotype.Service;

@Service
public class ActivityServiceImpl extends ServiceImpl<ActivityMapper, Activity> implements ActivityService {

    @Override
    public Activity getActivityById(Integer id) {
        return getById(id);
    }

    @Override
    public boolean updateParticipants(Integer activityId, Integer change) {
        Activity activity = getById(activityId);
        if (activity == null) {
            return false;
        }
        activity.setCurrentParticipants(activity.getCurrentParticipants() + change);
        return updateById(activity);
    }
}
