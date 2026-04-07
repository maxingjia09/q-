package com.outdoorclub.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.outdoorclub.entity.User;
import com.outdoorclub.mapper.UserMapper;
import com.outdoorclub.service.UserService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    @Override
    public User login(String email, String password) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("email", email)
                .eq("password", password)
                .eq("status", 1);
        User user = baseMapper.selectOne(queryWrapper);
        if (user != null) {
            user.setLastLoginAt(LocalDateTime.now());
            updateById(user);
        }
        return user;
    }

    @Override
    public User register(User user) {
        user.setPoints(0);
        user.setLevel("普通会员");
        user.setIsAdmin(0);
        user.setStatus(1);
        save(user);
        return user;
    }

    @Override
    public User getByEmail(String email) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("email", email);
        return baseMapper.selectOne(queryWrapper);
    }

    @Override
    public boolean updatePoints(Integer userId, Integer points, String type) {
        User user = getById(userId);
        if (user == null) {
            return false;
        }
        if ("recharge".equals(type)) {
            user.setPoints(user.getPoints() + points);
        } else if ("consume".equals(type)) {
            if (user.getPoints() < points) {
                return false;
            }
            user.setPoints(user.getPoints() - points);
        }
        return updateById(user);
    }
}
