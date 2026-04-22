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
@TableName("activities")
public class Activity {
    @TableId(type = IdType.AUTO)
    private Integer id;
    private String name;
    private String type;
    private String location;
    private String description;
    private String difficulty;
    private String duration;
    private String altitude;
    private String height;
    private String image;
    private Integer maxParticipants;
    private Integer currentParticipants;
    private String status;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}