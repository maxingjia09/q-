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
@TableName("user_activities")
public class UserActivity {
    @TableId(type = IdType.AUTO)
    private Integer id;
    private Integer userId;
    private Integer activityId;
    private Integer clubId;
    private String status;
    private LocalDateTime registrationDate;
    private LocalDateTime activityDate;
    private String formData;
    private String paymentStatus;
    private Double paymentAmount;
    private LocalDateTime paymentTime;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}