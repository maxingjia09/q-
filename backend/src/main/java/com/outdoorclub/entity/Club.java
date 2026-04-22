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
@TableName("clubs")
public class Club {
    @TableId(type = IdType.AUTO)
    private Integer id;
    private String name;
    private String logo;
    private String image;
    private Double rating;
    private Integer reviewCount;
    private String founded;
    private String experience;
    private String guides;
    private String description;
    private String contactPhone;
    private String contactEmail;
    private String address;
    private String status;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}