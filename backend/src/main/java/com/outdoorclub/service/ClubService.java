package com.outdoorclub.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.outdoorclub.entity.Club;

public interface ClubService extends IService<Club> {
    Club getClubById(Integer id);
    boolean updateRating(Integer clubId);
}
