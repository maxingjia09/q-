package com.outdoorclub.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.outdoorclub.entity.Course;
import com.outdoorclub.mapper.CourseMapper;
import com.outdoorclub.service.CourseService;
import org.springframework.stereotype.Service;

@Service
public class CourseServiceImpl extends ServiceImpl<CourseMapper, Course> implements CourseService {

    @Override
    public Course getCourseById(Integer id) {
        return getById(id);
    }

    @Override
    public boolean updateParticipants(Integer courseId, Integer change) {
        Course course = getById(courseId);
        if (course == null) {
            return false;
        }
        course.setCurrentParticipants(course.getCurrentParticipants() + change);
        return updateById(course);
    }
}
