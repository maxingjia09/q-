package com.outdoorclub.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.outdoorclub.entity.UserCourse;
import com.outdoorclub.mapper.UserCourseMapper;
import com.outdoorclub.service.UserCourseService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class UserCourseServiceImpl extends ServiceImpl<UserCourseMapper, UserCourse> implements UserCourseService {

    @Override
    public UserCourse joinCourse(Integer userId, Integer courseId, String formData) {
        UserCourse userCourse = UserCourse.builder()
                .userId(userId)
                .courseId(courseId)
                .status("pending")
                .registrationDate(LocalDateTime.now())
                .formData(formData)
                .paymentStatus("unpaid")
                .progress(0)
                .build();
        save(userCourse);
        return userCourse;
    }

    @Override
    public boolean updateCourseStatus(Integer id, String status) {
        UserCourse userCourse = getById(id);
        if (userCourse == null) {
            return false;
        }
        userCourse.setStatus(status);
        return updateById(userCourse);
    }

    @Override
    public boolean updateProgress(Integer id, Integer progress) {
        UserCourse userCourse = getById(id);
        if (userCourse == null) {
            return false;
        }
        userCourse.setProgress(progress);
        return updateById(userCourse);
    }
}
