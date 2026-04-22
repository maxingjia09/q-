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
@TableName("courses")
public class Course {
    @TableId(type = IdType.AUTO)
    private Integer id;
    private String name;
    private String image;
    private String shortDescription;
    private String detailedDescription;
    private String difficulty;
    private String duration;
    private String prerequisites;
    private String targetAudience;
    private String category;
    private Double price;
    private Integer maxParticipants;
    private Integer currentParticipants;
    private String status;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}