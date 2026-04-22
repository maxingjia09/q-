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
@TableName("club_routes")
public class ClubRoute {
    @TableId(type = IdType.AUTO)
    private Integer id;
    private Integer clubId;
    private String name;
    private Double price;
    private String description;
    private String difficulty;
    private String duration;
    private String location;
    private String image;
    private String status;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}