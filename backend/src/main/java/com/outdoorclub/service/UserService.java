package com.outdoorclub.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.outdoorclub.entity.User;

public interface UserService extends IService<User> {
    User login(String email, String password);
    User register(User user);
    User getByEmail(String email);
    boolean updatePoints(Integer userId, Integer points, String type);
}
