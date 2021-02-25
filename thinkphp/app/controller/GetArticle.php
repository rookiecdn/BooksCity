<?php
declare (strict_types = 1);

namespace app\controller;
use think\Exception;
use think\Request;
use app\model\Article;
use app\model\Replys;
use app\model\Secendreplys;
use app\model\Likes;
use app\model\Alloation;
use think\facade\Filesystem;
use think\facade\Db;

class GetArticle
{
   /*
     * 首页默认显示的文章列表
     **/
    public function index()
    {
        $len = request()->param('len')*1;
        //显示文章的简介资源 首页的简介帖子 类型一级评论熟练 点赞数量
        $data = Article::with(['types','lovesPeops'=>function($query){
            $query->where('authorId',request()->param('authorId'));
        }])->limit(0,$len)->order("articleId",'desc')->select()->toArray();
        return $data;
    }
    /*
     * 测试喜欢列表
     * */
    public function D(){
        dump(Article::with(['lovesPeops'=>function($query){
            $query->where('authorId',request()->param('authorId'));
        }])->select()->toArray());
    }
    /*
     *  显示指定帖子的详细内容
     *  获取指定帖子的评论信息  ( 一级包含二级 )
     * */
    public function indexDetail()
    {
        //scope模型查询出指定的数据  $id 是帖子的id               类型    获取一级评论
        $data = Article::scope('current',request()->param('id'))->with(['types','articleImgs','replys'=>function($query) {
            //thisReplys获取一级评论对应的二级评论
            $query->with(['userContentImg', 'thisReplys'=>function($query){
                $query->with('userContentImg');
            }, 'userContentImg' => function ($query) {
                //获取一级评论回复的图片
                $query->where(['vestIn' => 1]);
            }]);
        },'lovesPeops'=>function($query){
            $query->where('authorId',request()->param('authorId'));
        }])->order("createTime",'ASC')->select()->toArray();
//        dump($data);
        return $data;
    }
    /*
     * 新增一个帖子
     * */
    public function save(Request $req)
    {
        //输出图片   //有值返回true  没有返回false
        //dump($req->file() === null);
        //新增数据
        //获取其字符信息
        //基本信息
        //( title:用户的昵称,authorId:作者的id,textContent:文章的内容,
        //  content:文章的标题,img:作者的头像,comment:评论数量,loves:喜欢的人数  )
        //附带信息,如果接收的有图片信息,那么就将他添加到vestIn=3  id=帖子的id的
        //获取文章信息
        global $inserDatas,$types,$TypeData,$result,$replysImg;
        //获取文字
        $inserDatas = json_decode( $req->param('data'),true );
        //获取类型
        $types = json_decode( $req->param('types'),true );
        //获取类型,初始化为空
        $TypeData = [];
        //获取要上传图片的信息
        $replysImg = [];
        //获取处理的结果,初始化为null
        $result = null;
        //构造模型实例化
        global $Article,$TypeModel;
        $Article   =  new Article();
        $TypeModel =  new Alloation();
        try {
                //如果没有上传图片
                //转换接收的参数
                //事务模式处理数据,要么都成功,要么都失败
                $GLOBALS['result'] = Db::transaction(function () {
                    //处理文字
                    $GLOBALS['Article']->save($GLOBALS['inserDatas']);
                    //获取新增的id
                    $newId = $GLOBALS['Article']->articleId;
                    //处理类型
                    foreach ($GLOBALS['types'] as $t=>$t_value){
                        array_push($GLOBALS['TypeData'],[
                            "article_id" => $newId,
                            "types_id"  => $t_value['id']
                        ]);
                    }
                    //加入中间件
                    $GLOBALS['TypeModel']->saveAll($GLOBALS['TypeData']);
                    //处理图片
                    //如果有图片就执行
                    if(request()->file() !== null){
                        //上传图片
                        foreach (request()->file() as $v){
                            $path =  Filesystem::putFile('replys', $v);
                            array_push($GLOBALS['replysImg'],["vestIn"=>3,"replysId"=>$newId,"img"=>$path]);
                        }
                        //图片关系 上传图片
                        $GLOBALS['Article'] = Article::find($newId);     //找到刚才插入的
                        $GLOBALS['Article']->articleImgs()->saveAll($GLOBALS['replysImg']); //插入到关联键中
                    }
            });
            //执行成功返回202
            return 202;
        }catch(Exception $e){
            //上传失败返回404
            return 404;
        }
    }
    /*
     * 筛选我喜欢的帖子
     * */
    public function My($id,$list)
    {
        $result = Article::where('authorId',request()->param('id'))->with(['types','lovesPeops'=>function($query){
            $query->where('authorId',request()->param('id'));
        }])->limit(0,request()->param('list')*1)->select()->toArray();
        // dump($result);
        return $result;
    }
    /*
     * 搜索查询的数据
     * */
    public function SearchResult(){
        // 搜索的文本: request()->param('include')
        // 包含搜索:   标题中含有'文本'的   作者名称中包含'文本'的   文章内容中包含文本的
        // 类型: request()->param('types')
        // 文章类型包含选择的类型就行
        $model = Article::where("title","like","%".request()->param('include')."%")
                 ->whereOr("content","like","%".request()->param('include')."%")
                 ->whereOr("textContent","like","%".request()->param('include')."%")
                 ->with(['types','lovesPeops'=>function($query){
                     $query->where('authorId',request()->param('authorId'));
                 }])
                 ->limit(0,request()->param('id')*1)
                 ->select()->toArray();
        return $model;
    }
    /*
     * 获取我喜欢的帖子
     * */
    public function SearchMyloves(){
        // 接收两个参数
        // 一个是用户的id
        // 一个是请求多少条数据
//        request()->param("authorId");
//        request()->param("len");
        //遍历数组的参数
        $articleId = [];
        //先获取喜欢的数据五条
        $model = Likes::where(["authorId" =>request()->param("authorId")])
        ->order("id","desc")
        ->limit(0,request()->param("len"))
        ->select()->toArray();
        //将数据存放到数组中
        foreach ($model as $v){
            array_push($articleId,$v['articleId']);
        }
        //查找指定的数据
        $mylovearticle = Article::
        with(['types','lovesPeops'=>function($query){
             $query->where('authorId',request()->param("authorId"));
        }])
        ->select($articleId)->toArray();
        //返回
        return $mylovearticle;
    }
    /*
     * 管理帖子->删除   帖子无法修改
     * */
    public function delete()
    {
        try {
            $dd = Db::transaction(function(){
                //先查询帖子是否还存在
                $articledDEL = Article::find(request()->param('articleId'));
                if($articledDEL!==null) {
                    //删除帖子以及关系             帖子的图片  帖子的类型   帖子的一级评论
                    $model = Article::with(["articleImgs", "whereTypes", "replys", "GetLovePeople"])
                                    ->find(request()->param('articleId'));
                    //关联删除  删除帖子的图片和帖子数据
                    $result = $model->together(['articleImgs', "whereTypes", "replys", "GetLovePeople"])->delete();
                    return $result;
                }else{
                    return false;
                }
            });
            //执行成功返回影响行数
            if($dd){
                //成功返回1
                return 1;
            }else{
                //删除失败或找不到返回0
                return 0;
            }
        }catch (Exception $exception){
            //失败执行这一句
            return 0;
        }
    }

}
