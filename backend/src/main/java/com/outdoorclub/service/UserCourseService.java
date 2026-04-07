package com.outdoorclub.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.outdoorclub.entity.UserCourse;

public interface UserCourseService extends IService<UserCourse> {
    UserCourse joinCourse(Integer userId, Integer courseId, String formData);
    boolean updateCourseStatus(Integer id, String status);
    boolean updateProgress(Integer id, Integer progress);
}
