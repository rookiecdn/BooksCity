<?php
declare (strict_types = 1);

namespace app\controller;

use think\Request;
# 帖子数据
use app\model\Article;

class Admins
{
    /**
     * 获取全部帖子数据
     * **/
    public function GetAllAticle()
    {
        # code...
        $result = Article::select()->toArray();
        return $result;
    }
}
