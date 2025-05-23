---
outline : 2-3
---
# 更新指南<Badge type="warning" text="beta" />
::: details 编写人员

**此部分由以下人员编写:**
<MemberBlock :filterNames="names" />

<script setup>

const names = [
'Mars','Mueo',
];
</script>

:::
:::tip
此部分内容随时可能更新，请以最新内容为准。另外招募编写此类规范内容的人员

:::
## 更新流程  
### 更新内容要求  
- 检查更新内容是否与书中原文一致（标注章节）
- 是否与现有条目冲突（如时间线、情节设定矛盾） 
### 合并操作  
- **1.合并更新**：  
将更新内容与已有内容合并，请勿遗漏一字一句，如有更改，请标明至更新记录

示例:
::: code-group
```js [更新内容]
行刑之刻(SSS)
基础信息： 权杖/半神器
首次出场于第60章
效果描述： 发出一道恐怖的雷罚
外观描述：一柄顶端缠绕雷霆的权杖 // [!code ++]
已知持有者/拥有记录： 大审判庭，墨秋斯，程实 
备注：
第一次【神战】结束后【秩序】杀死了【鸣雷】并用祂一半的神性制作了这柄鸣雷之杖。// [!code ++]
本物品后被【死亡】用于与【恐惧来临之时】中提取的乐乐尔神性融合，制成了【骨仆乐乐尔之戒】。// [!code ++]
```
```js [wiki原文]
行刑之刻(SSS)
基础信息： 权杖/半神器
首次出场于第60章
效果描述： 发出一道恐怖的雷罚
已知持有者/拥有记录： 大审判庭，墨秋斯，程实
备注： 本物品后被【死亡】用于与【恐惧来临之时】融合，成为【骨仆乐乐尔之戒】 // [!code --]
```
:::

- **2.冲突处理**:  
若与现有内容冲突（如角色年龄争议），保留原内容并添加注释：  

``` 
争议点：xx年龄推测（详见第xx章）     
当前版本：青年（25-30岁）  
待定版本：未知（书中无描述）       
```  
- **3.变更概述**  
在文件末尾添加 **更新日志**
```md
更新记录  
​- 2024/03/01：  
- 新增道具“行刑之刻”效果描述（第150章xxxx） 
- 修正“龙井”外貌描述
- 优化“毒药”的背景故事描述
（三种例子如上，日期必填）
```

- **4.总和与提交审核**   
将你的稿件提交给审核，完整示例如下：
```md
标题：内容更新-行刑之刻
行刑之刻（SSS）
基础信息： 权杖/半神器
首次出场于第60章
效果描述： 发出一道恐怖的雷罚
外观描述：一柄顶端缠绕雷霆的权杖
已知持有者/拥有记录： 大审判庭，墨秋斯，程实
备注：
第一次【神战】结束后【秩序】杀死了【鸣雷】并用祂一半的神性制作了这柄鸣雷之杖。 
本物品后被【死亡】用于与【恐惧来临之时】中提取的乐乐尔神性融合，制成了【骨仆乐乐尔之戒】。

争议点：“已知持有者/拥有记录”争议（详见xxx章）
当前版本：大审判庭，墨秋斯，程实
待定版本：墨秋斯，程实

更新记录
-2025/5/1:
-新增道具“行刑之刻”效果描述（第150章xxxx）
-修正道具“行刑之刻”基础信息描述不当
```

## 更新内容分类与优先级
|  **更新类型**  |                  **处理方式**                   | 要求                   |
| :--------: | :-----------------------------------------: | :------------------- |
| **重大更新** | 涉及角色事件、游戏规则修改（如背景故事），需在更新记录里标明两个版本内容并注明章节出处 | 尽量不歪曲事实，语句通顺，与原文一一对应 |
|  **内容补全**  |     新增书中已存在但未收录的设定（如道具、天赋），直接合并后标注来源章节。     | 不与原文相违背，语句上下承接       |
|  **错误修正**  |             术语错误、描述修正等，需概述更改情况              | 不犯二次错误               |
|  **格式优化**  |           wiki条目结构调整、替换，需确保无内容变更。           | 遵守编写要求、审核贡献指南进行      |


