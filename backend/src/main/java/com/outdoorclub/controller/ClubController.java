package com.outdoorclub.controller;

import com.outdoorclub.common.Result;
import com.outdoorclub.entity.Club;
import com.outdoorclub.service.ClubService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/club")
@Api(tags = "俱乐部管理")
public class ClubController {

    @Autowired
    private ClubService clubService;

    @GetMapping("/list")
    @ApiOperation("获取俱乐部列表")
    public Result<List<Club>> getClubList() {
        List<Club> clubs = clubService.list();
        return Result.success(clubs);
    }

    @GetMapping("/detail")
    @ApiOperation("获取俱乐部详情")
    public Result<Club> getClubDetail(@RequestParam Integer id) {
        Club club = clubService.getClubById(id);
        if (club != null) {
            return Result.success(club);
        } else {
            return Result.error(404, "俱乐部不存在");
        }
    }

    @PostMapping("/create")
    @ApiOperation("创建俱乐部")
    public Result<Club> createClub(@RequestBody Club club) {
        boolean saved = clubService.save(club);
        if (saved) {
            return Result.success(club);
        } else {
            return Result.error(500, "创建失败");
        }
    }

    @PostMapping("/update")
    @ApiOperation("更新俱乐部")
    public Result<Club> updateClub(@RequestBody Club club) {
        boolean updated = clubService.updateById(club);
        if (updated) {
            return Result.success(clubService.getById(club.getId()));
        } else {
            return Result.error(500, "更新失败");
        }
    }

    @PostMapping("/delete")
    @ApiOperation("删除俱乐部")
    public Result<Boolean> deleteClub(@RequestParam Integer id) {
        boolean deleted = clubService.removeById(id);
        if (deleted) {
            return Result.success(true);
        } else {
            return Result.error(500, "删除失败");
        }
    }
}
