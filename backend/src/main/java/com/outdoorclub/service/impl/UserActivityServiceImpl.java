package com.outdoorclub.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.outdoorclub.entity.UserActivity;
import com.outdoorclub.mapper.UserActivityMapper;
import com.outdoorclub.service.UserActivityService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class UserActivityServiceImpl extends ServiceImpl<UserActivityMapper, UserActivity> implements UserActivityService {

    @Override
    public UserActivity joinActivity(Integer userId, Integer activityId, Integer clubId, String formData) {
        UserActivity userActivity = UserActivity.builder()
                .userId(userId)
                .activityId(activityId)
                .clubId(clubId)
                .status("pending")
                .registrationDate(LocalDateTime.now())
                .formData(formData)
                .paymentStatus("unpaid")
                .build();
        save(userActivity);
        return userActivity;
    }

    @Override
    public boolean updateActivityStatus(Integer id, String status) {
        UserActivity userActivity = getById(id);
        if (userActivity == null) {
            return false;
        }
        userActivity.setStatus(status);
        return updateById(userActivity);
    }
}
