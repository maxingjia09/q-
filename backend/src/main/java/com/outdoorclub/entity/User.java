package com.outdoorclub.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@TableName("users")
public class User {
    @TableId(type = IdType.AUTO)
    private Integer id;
    private String username;
    private String email;
    private String password;
    private String phone;
    private String avatar;
    private Integer points;
    private String level;
    private Integer isAdmin;
    private Integer status;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
    private LocalDateTime lastLoginAt;
}