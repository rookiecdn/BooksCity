<?php
declare (strict_types = 1);

namespace app\controller;
use app\model\Replys;
use app\model\Article;
use think\Exception;
use think\facade\Db;
use think\Request;
use app\model\Secendreplys;
use think\facade\Filesystem;

class GetReplys
{
    /**
     * 获取指定帖子的所有评论信息
     *
     * @return \think\Response
     */
    public function index()
    {
        //获取指定一级评论的数据
        $result = Replys::withSearch('Sen',['id'=>request()->param('id')])->with(['userContentImg'=>function($query){
            $query->where('vestIn',1);
        },'thisReplys'=>function($query){
            $query->with(['userContentImg'=>function($query){
                $query->where('vestIn',2);
            }]);
        }])->select()->toArray();
//        dump($result);
        return $result;
    }
    /**
     * 显示创建资源表单页.
     *
     * @return \think\Response
     */
    public function create()
    {

    }
    /**
     * 保存新建的资源
     *
     *
     */
    public function save(Request $res)
    {
        // 作者id,帖子id,作者头像,作者昵称,评论的内容，评论的图片
        // 添加新评论
        // 没图片直接上传文字
        // 获取文字
        global $data,$img,$resnum,$article,$secendreplys,$replys,$result;
        $data = json_decode($res->param("data"),true);
        //获取图片
        $img = request()->file();
        //如果图片为空.那么就只处理文字
        //实例化数据库
        $replys = new Replys();    //一级评论
        $secendreplys = new Secendreplys();   //二级评论
        $article = new Article();             //文章
        //接收结果
        $result = null;
        //初始化计数器
        $resnum = 0;
        //公用数据
        global $model,$key,$img,$Table,$vestIn;
        $model = null;  //要操作的表,增删改
        $key = null;    //表的主键
        $Table = null;  //添加完指定数据后,要修改指定表的comment
        $vestIn = null; //评论归属
        //前端传来的是replysId,也就是一级评论的id,我们要向一级评论里面添加数据
        if(!empty($data['replysId'])){
            $model = $GLOBALS['secendreplys'];
            $key = "replysId";
            $Table = $GLOBALS['replys'];
            $vestIn = 2;
        }
        //前端传来的是articleId,也就是帖子的id,我们要向帖子里面添加数据
        //空时为true
        if(!empty($data['articleId'])){
            $model = $GLOBALS['replys'];
            $key = "articleId";
            $Table = $GLOBALS['article'];
            $vestIn = 1;
        }
            //更新
            try {
                Db::transaction(function(){
                    //上传文字
                    $GLOBALS['model']->save($GLOBALS['data']);
                    //查询更新后的说说一共多少条
                    $GLOBALS['resnum']  = $GLOBALS['model']->where($GLOBALS['key'],$GLOBALS['data'][$GLOBALS['key']])->select()->count();
                    //更新说说的评论数据
                    $renewal = $GLOBALS['Table']->find($GLOBALS['data'][$GLOBALS['key']]);
                    $renewal->comment = $GLOBALS['resnum'];
                    $renewal->save();
                    //如果图片有值就执行否则就跳过不执行
                    if(!($GLOBALS['img'] === null)){
                        //获取新id
                        $newId  = $GLOBALS['model']->id;
                        //上传图片
                        $IMGS = [];
                        //上传图片
                        foreach ($GLOBALS['img'] as $v){
                            $path =  Filesystem::putFile('replys', $v);
                            array_push($IMGS,["vestIn"=>$GLOBALS['vestIn'],"replysId"=>$newId,"img"=>$path]);
                        }
                        //通过新id添加图片
                        $GLOBALS['model']->find($newId)->userContentImg()->saveAll($IMGS);
                    }
                });
            }catch (Exception $exception){
                return 404;
            }
            return 200;
        }
    /**
     * 显示指定的资源
     *
     * @param  int  $id
     * @return \think\Response
     */
    public function read($id)
    {
        //
    }
    /**
     * 显示编辑资源表单页.
     *
     * @param  int  $id
     * @return \think\Response
     */
    public function edit($id)
    {
        //
    }
    /**
     * 保存更新的资源
     *
     * @param  \think\Request  $request
     * @param  int  $id
     * @return \think\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * 删除指定资源
     *
     * @param  int  $id
     * @return \think\Response
     */
    public function delete($id)
    {
        //
    }
}
