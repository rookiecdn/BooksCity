<?php
declare (strict_types = 1);

namespace app\controller;

use app\model\Author;
use think\Request;

class GetUserLoveArticle
{
    //传出用户喜欢了什么文章
    public function find(){
        $model = Author::where('id',request()->param('id'))->with(["FavoritePosts"])->select()->toArray();
        return $model;
    }
}
