package com.outdoorclub.controller;

import com.outdoorclub.common.Result;
import com.outdoorclub.entity.User;
import com.outdoorclub.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@Api(tags = "用户管理")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    @ApiOperation("用户登录")
    public Result<User> login(@RequestParam String email, @RequestParam String password) {
        User user = userService.login(email, password);
        if (user != null) {
            return Result.success(user);
        } else {
            return Result.error(401, "邮箱或密码错误");
        }
    }

    @PostMapping("/register")
    @ApiOperation("用户注册")
    public Result<User> register(@RequestBody User user) {
        User existingUser = userService.getByEmail(user.getEmail());
        if (existingUser != null) {
            return Result.error(400, "邮箱已被注册");
        }
        User newUser = userService.register(user);
        return Result.success(newUser);
    }

    @GetMapping("/info")
    @ApiOperation("获取用户信息")
    public Result<User> getUserInfo(@RequestParam Integer id) {
        User user = userService.getById(id);
        if (user != null) {
            return Result.success(user);
        } else {
            return Result.error(404, "用户不存在");
        }
    }

    @PostMapping("/update")
    @ApiOperation("更新用户信息")
    public Result<User> updateUser(@RequestBody User user) {
        boolean updated = userService.updateById(user);
        if (updated) {
            return Result.success(userService.getById(user.getId()));
        } else {
            return Result.error(500, "更新失败");
        }
    }

    @PostMapping("/recharge")
    @ApiOperation("充值积分")
    public Result<Boolean> rechargePoints(@RequestParam Integer userId, @RequestParam Integer points) {
        boolean success = userService.updatePoints(userId, points, "recharge");
        if (success) {
            return Result.success(true);
        } else {
            return Result.error(500, "充值失败");
        }
    }
}
