<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006~2018 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: liu21st <liu21st@gmail.com>
// +----------------------------------------------------------------------
use think\facade\Route;

Route::group(function (){
    //登录
    Route::group("/Login/",function(){
        Route::any("/in/:account/:password","login");
        Route::post("/in","login");
        Route::post("/editMyData","editMyData");
        Route::post("/register","register");
    })->prefix("UserLogin/");
    //类型
    Route::group('/Types/',function(){
        Route::any('/select/:lmt/[:wh]','index');
        Route::get('/save/:typeValue','save');
        Route::post('/save','save');
    })->prefix('GetTypes/');
    //帖子路由
    Route::group('/Article/',function(){
        Route::get('select/:len/[:authorId]','index');
        Route::get('save','save');
        Route::any('My/:id/:list','My');
        Route::post('save','save');
        //输出文章详细内容
        Route::put('selectDetail/:id/[:authorId]','indexDetail');
        //查询的数据
        Route::put('/search/:id','SearchResult');
        //删除指定文章
        Route::put("/delete",'delete');
        //获取我喜欢的帖子
        Route::put("/SearchMyloves","SearchMyloves");
        //测试路由
        Route::any('D','D');
        Route::any('E','E');
    })->prefix('GetArticle/');
    //点赞路由
    Route::group("/Likes/",function(){
        //点赞
        Route::get("/add/:authorId/:articleId",'loves');
    })->prefix('Likes/');
    //获取用户对应的喜欢文章
    Route::group("/GetUserLoveArticle/",function(){
        //点赞
        Route::any("/find",'find');
    })->prefix('GetUserLoveArticle/');
    //评论路由
    Route::group('/Replys/',function(){
        //$id是帖子的id,$curr一级评论的id
        Route::post('select','index');
        Route::any('save','save');
    })->prefix('GetReplys/');
    //消息路由
    Route::group('/News',function(){
        Route::post('/all',"index");
        Route::post('/add',"Add");
        Route::post('/Get',"GetMSG");
        Route::post('/SetReaded',"SetReaded");
    })->prefix("GetAllthenews/");
    //管理员操作
    Route::group('/Admins',function(){
        Route::any('/GetAllAticle','GetAllAticle');
    })->prefix("Admins/");
    //管理员删除指定文章
    Route::any("/Article/delete",'GetArticle/delete');
})->allowCrossDomain([
    'Access-Control-Allow-Origin'   => 'http://localhost:8080',
    "Access-Control-Allow-Methods"  => "POST, GET, DELETE, OPTIONS, DELETE",
    "Access-Control-Allow-Headers"  => "Content-Type, x-requested-with, X-Custom-Header, HaiYi-Access-Token"
]);
