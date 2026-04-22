package com.outdoorclub.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.outdoorclub.entity.Course;

public interface CourseService extends IService<Course> {
    Course getCourseById(Integer id);
    boolean updateParticipants(Integer courseId, Integer change);
}
