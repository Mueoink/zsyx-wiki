---
outline : 2-3
---
# 编写指南 <Badge type="warning" text="beta" />
::: details 编写人员

**此部分由以下人员编写:**
<MemberBlock :filterNames="names" />

<script setup>

const names = ['Mueo','Mars'
];

</script>

:::

:::tip
此部分内容随时可能更新，请以最新内容为准。另外招募编写此类标准内容的人员

:::

## 一、基础原则

1.  **严谨性**：核心设定必须基于小说原文，避免主观臆断。  
2.  **趣味性**：允许在非关键描述中添加符合世界观基调的吐槽、冷笑话或梗（例：角色档案的“备注”栏）。  
3.  **模块化**：内容按分类独立成页，交叉引用时需标注跳转链接（如“参见[XX角色]”）。  

## 二、分类格式规范
:::info
标准和规范仅供参考，但在无更优格式时，请遵守编写要求。所有备注内容，均为可选。如无备注，建议不提交备注词条

:::
> [!IMPORTANT]
> 所有概览类条目，均最高级的标题，而非目录下的子词条

### 1. 主要人物条目
**标题格式：** [角色名]（称号/别名）  （例：红霖（大猫））  
**内容结构：**   
**基础信息：** 性别、身份（如繁荣神选）、id(若只有ID则此词条不填写)、信仰、年龄区间（若已知，如老人、少女）、初次登场章节。  
**外貌特征：** 描述标志性装扮或身体特征，若全书无任何描述可省略  
**性格分析：** 结合剧情行为总结，避免过度脑补，争议点需标注“待考证”。   
**角色面板：**（总结最新一次的面板）  
**角色背包：**（写上已知的关键道具即可）  
**背景故事：** 按时间线梳理  
**关联角色：** 敌对/盟友/暧昧关系  
**所属势力：**（所属势力划分）  
**备注：** 可添加玩梗内容（例：“据不可靠消息，该角色背包里有50把手术刀”）。  

```
示例:
龙井
基本信息
性别：男  
id：龙王2B，【欺诈】好骂  
身份：欺诈榜三（前欺诈榜二）     
信仰：欺诈    
职业：战士—杂技演员  
年龄区间： 20-30  
初次登场章节：
(略)
外貌特征:(略)
性格分析：(略)
角色面板：  
【欺诈】榜三（原文未具体描写）
角色背包：  (略)
背景故事 : (略)
关联角色: (略)
所属势力:庸人会
备注: (略)
```

---
### 2. 天赋/技能条目

**标题格式：** [天赋名称][等级]（例：欺骗大师(SS)）  
**内容结构：**  
**基础信息：** 信仰,主动/被动/弃誓,首次出现章节   
**效果描述：** （提供该天赋的详细描述）  
**已知持有的主要角色：** 列举已知拥有该天赋的主要角色即可  

```
示例:
秩序的微光(S)
基础信息：【秩序】信仰天赋,主动,首次出现于X章
效果描述：在一定范围内，当目标与你遵守相同的秩序时，目标可以与你保持相同的身体状态，此状态可对目标隐藏。
备注：还好我是个好人
```

---

### 3. 道具/装备条目

**标题格式：** [道具名称] [等级] （例：鼻涕水(SS)）  
**内容结构：**  
**基础信息：** 类型（如武器、消耗品）,首次出现章节  
**效果描述：** （提供该道具的详细描述，如道具说明、特殊效果等）  
**已知持有者/拥有记录：** 列举已知持有该道具的角色或势力，以及道具的历史传承（若有）  
**备注：** 可添加与道具相关的背景、来源、梗或趣味细节。  
```
示例:
往逝者手骨之胸针(S)
基础信息： 圣器（饰品/武器）,首次出现于第98章

效果描述：

特殊效果【逝者回忆】：你可以与一具死亡不超过12小时的尸体对话，它将按照生前记忆如实回答你的第一个问题。

特殊效果【这不是赐予，而是交易】：每当你使用一次【逝者回忆】，你需要为王座上那位尊贵的大人，献上一份祭品。

已知拥有者/拥有记录： 程实

备注： 一枚由【死亡】亲自锻造的胸针，蕴含了祂对【记忆】某些权柄的伟大理解。

```

---

### 4. 世界观条目

#### 4.1 世界观概览条目
**标题格式：** [主题] （如：背景）  
**内容结构：**  
**描述**: 主题的描述，例如：设定、世界结构、详细背景等。     
**备注**:  可添加世界观相关的宏观设定或总结性吐槽。

#### 4.2 诸神信仰 - 神明概览条目

**标题格式：** 神明概览  
**内容结构：**  
**神系概况**: 概述世界观中的神明体系，例如：神明的数量、体系划分、诞生纪元等。  
**描述**:  列举并简要介绍神明，包括神名、司掌权柄、形象、神域等，可链接到具体的 **[神明条目]**。   
**表现**:  阐述神与凡人之间的互动、影响方式等神带给世界的影响。  
**备注**:  可添加神明相关的解读或背景故事补充。  

#### 4.3 地理划分 - 地理概览条目
**标题格式：** 地理概览  
**内容结构：**  
**世界地图**:  描述世界的地理构成，如希望之州、倒坠之门、虚空等。    
**地域**:  列举并简要介绍世界中的主要地理区域，例如：主要大陆、重要城市、特殊地形等，并链接到具体的 **[地域条目]**。    
**备注**:  可添加地理设定相关的趣味细节或说明

#### 4.4 种族划分 - 种族概览条目
**标题格式：** 种族概览  
**内容结构：**  
**种族体系**:  概述世界观中的种族分类体系，例如：主要种族、亚种、类人生物等。  
**主要种族**:  列举并简要介绍世界中的主要种族，包括种族名、外貌特征、信仰、历史事件等，可链接到具体的 **[种族条目]**。  
**种族关系**:  描述各种族之间的关系，例如：共存、冲突、支配与被支配等。（如果有）   
**地理位置**:  阐述种族分布情况。  
**备注**:  可添加种族设定相关的趣味设定或种族梗。  

---

### 5. 世界观地理条目
**标题格式：**[主标题]-[子标题] （例：地域-希望之洲）  
**内容层级：**  
**时间线：** 分纪元/大事件节点，争议历史事件需标注差异  
**地理志：** 地图区域+势力范围  
**势力档案：** 已知活跃的势力  
**主流信仰：**（标注最活跃的主流信仰）  
**备注：** 每页底部可添加数条备注细节或适当整活  

---

### 6. 种族条目

**标题格式：** [种族名称] （例：蕈人）  
**内容结构：**  
**种族概况**:  概述种族的基本信息，例如：起源、信仰、社会结构、特点等。  
**外貌特征**:  详细描述种族的外貌特征，例如：体型、肤色、毛发、眼睛、耳朵等。  
**特质**:  描述种族在能力、天赋上的普遍倾向，例如：擅长的技能、魔法、体质等。（如果有）   
**历史**:  简述种族的历史发展、重要事件、与其他种族的互动等。  
**代表人物**:  列举种族中具有代表性的角色，可链接到对应 [角色条目]。  
**备注**:  可添加种族相关的趣味设定、种族梗。  

```
示例:
蕈足人
种族概况:
首次出场在第271章
起源:
生活在希望之洲西南的雨林中
（有一支族群因亵渎【繁荣】被赶到希望之洲地底的叹息森林）
信仰:【繁荣】
社会结构:
族长管理着族群的成员
特点:
对雨林生态和肥沃土地的依赖性过高，使他们几乎从不远行
外貌特征:略
特质:略
历史:略
代表人物:
老族长：阿卢韦尼（首次出场于273章）
备注:
站着睡觉还不用吃饭，那很酷了朋友
```

---

### 7. 神明条目

#### 7.1 真神条目
**标题格式：** [体系]-[神名]（例：虚无-存在）  
**内容结构：**  
**神格**:  描述神明的神格特征，例如：善良、邪恶、中立、混乱等。  
**权柄**:  说明神明所掌管的领域或概念，例如：生命、死亡、战争、智慧等。  
**理念**:  介绍该神明的祷词、谕行、对信徒的要求等。    
**形象**:  描述神明在凡人面前显现时的形象，以及其神域、等视觉方面内容。  
**记录**:  收录与该神明相关的故事、传说、影响。  
**信仰群体**:  描述该神祇的信徒构成、教会组织、主要信仰地区等。  
**关系**:  描述该神明与其他神明之间的关系，例如：对立、胞神等。  
**备注**:  可添加相关的梗或说明

#### 7.2 从神条目
**标题格式：**[神名]-[真名]  （例：【净蠹之手】-赫罗伯斯）  
**内容结构：**    
**基本信息：** 所属信仰与命途（如【沉沦】的从神、真名、玩家名(如果是)）  
**地位：** 在所附属神明中的地位/血脉（如【繁荣之母】的女儿）  
**权柄：** 被神明赐予的权柄（例：滋生）    
**理念：**   个人信念（选填：靠近派，恐惧派…）    
**形象：**   描述该令使/从神在凡人面前显现时的形象，以及其神域、等视觉方面内容。   
**性格：** 根据书中描述概括性格     
**能力描述：** 出现过的能力    
**诞生/来源：** 出现的纪元时代、地点，及出现方式  
**记录：** 记录该角色的事件   
**信仰群体：** 所创建过的或是被作为信仰追随的势力/种族/某群体   
**关系：** 与相关角色的关系   
**备注：** 介绍该角色的梗或补充    
```
示例:
【净蠹之手】-赫罗伯斯
基本信息：
【湮灭】的令使
地位：【繁荣之母】的女儿）  
权柄：滋生
理念：靠近派，湮灭一切献给【湮灭】以此取悦祂 
形象：
极目远眺的苍穹之上，一轮骇人的恐怖的巨日虚影缓缓升起  
日轮边缘爆发着炽烈的火光，每一朵火花迸溅而出，都化作一颗巨大的陨石划过天际，朝着凡人们所在地带急速坠来！    
性格： 略
能力描述：
1.锁定一片地区，迸发陨石雨 
2.…
诞生/来源：
xxx来自希望之洲xxx地区，在x时代x纪元开始追随【xx】
记录：
迦楼罗与乐乐尔的爱情故事(详细略)
经历(包含在记录里):
1.沉沦时代-沉沦纪元：xxxx 
2.…… 
信仰群体：
丑角 # 注:由【愚戏】指引
关系：
被【繁荣】抛弃
备注：
迦楼罗是恋爱脑
```
---

### 8. 势力组织条目

#### 8.1 势力概览条目
**标题格式：** 势力概览  
**内容结构：**   
**势力描述**:  列举并概述世界观中存在的各种势力类型，例如：国家、教廷、联盟等。可链接到相关 **[势力条目]** 词条  
**备注**:  可添加势力设定相关的宏观分析或总结性吐槽。  

#### 8.2 玩家势力条目 & 8.3 非玩家势力条目
**标题格式：** [势力名称]  
**内容结构：**   
**势力介绍：** 简单介绍一下该势力  
**势力类型：** （如：信仰主流、隐秘组织等） 可链接到相关 **[神明条目]**  
**核心理念：** 势力的主要目标、信仰或行事准则。（ ~~如丑角为程小实招黑奴创立~~ ）  
**历史沿革：** 势力的建立、发展和重要历史事件（按时间线）  
**组织结构：** 势力内部的层级、派系构成（如已知）  
**重要人物：** 列举势力内的核心人物，可链接到对应 **[角色条目]**  
**势力范围：** 势力控制或影响力覆盖的地理区域或社会领域  可链接到对应 **[地域条目]**  
**与其他势力的关系：** 描述与其他主要势力之间的关系（盟友、敌对、竞争等）  
**备注：** 可添加与势力相关的细节补充   

---

### 9. 小说剧情时间线条目
 
#### 9.1 小说剧情条目 
> (例如：第一卷 中的事件)

**标题格式：** [卷名] (例：第一卷)  
**内容结构：**  
**章节范围:** 章节范围  
**概述**:  按照时间线，概述该卷的主要内容。   
**关键事件**:  按时间线列举该卷发生的重大历史事件，可链接到具体的[小说事件条目]。  
**代表人物/势力**:  列举该纪元的代表性人物或势力，可链接到对应的[角色条目]或[势力条目]。  
**备注**:  可添加相关的解读、梗  

#### 9.2 小说事件条目
**标题格式：**[卷名]-[事件名]（事件类型）（例：第一卷「XXX试炼」（试炼））  
**内容结构：**  
**章节范围:** 此事件的章节范围
**概述：** 概述事件内容，详细符合原文  
**关键节点：** 重要情节、重要角色互动  
**描述：** 详细的说明此次事件，如地域，时间线，影响，可链接到对应 **[条目]**  
**备注：** （同之前的备注）  

```
示例:
[永夜迷途][记忆] (特殊试炼)
试练目标：
交错的记忆中，总能找到一条出路，但前提是，夜没散去（限时12小时）
章节范围: xx-xx章
概述：(略)
关键节点：(略)
描述:(略)
时间线： 文明纪元中期
队友： (略)
备注:

```
---

### 10. 纪元故事线条目

#### 10.1 纪元故事线概览
**标题格式：** 纪元概览  
**内容结构：**  
**纪元划分**: 概述世界历史的纪元划分方式，例如：共分为几个纪元，各纪元的名称和大致时间范围。  
**纪元主题**:  简述每个纪元的主题或时代特征，例如：第一纪元-生命，第二纪元-沉沦等。  
**纪元演变**:  描述纪元更替的驱动因素、世界格局的变化趋势。  
**纪元与主线剧情**:  阐述各纪元与小说主线剧情的关联性，以及在不同纪元发生的关键事件。  
**备注**:  可添加纪元设定相关的宏观历史解读或时间线玩笑。  

#### 10.2 具体纪元条目 
> (例如：第一纪元-生命, 第二纪元-沉沦 下的事件)

**标题格式：** [纪元名称] - [纪元主题] (例：第一纪元 - 生命)   
**内容结构：**  
**纪元概述**:  概述该纪元的基本信仰、萌芽信仰、时代背景、主要种族/势力。   
**关键事件**:  按时间线列举该纪元发生的重大历史事件，可链接到具体的[纪元事件条目]。  
**特征**:  详细描述该纪元的社会、文化、科技、环境等方面的时代特征。  
**影响**:  阐述该纪元的影响，以及对当前时间线剧情的铺垫作用。  
**代表人物/势力**:  列举该纪元的代表性人物或势力，可链接到对应的[角色条目]或[势力条目]。  
**备注**:  可添加纪元历史相关的趣味解读、历史梗或未解之谜。  

#### 10.3 纪元事件条目
**标题格式：** [事件名称] (如：群星匕首)  
**内容结构：**   
**章节范围:** 此事件的章节范围或出现章节 
**概述：** 提炼核心内容   
**关键节点：** 重要情节、重要角色互动   
**描述：** 详细的说明此次事件，如地域，时间线，影响，可链接到对应 **[条目]**   
**备注：** （同之前的备注）   

---

### 11. 次要情节/人物条目<Badge type="danger">caution</Badge>
::: warning
该部分未经过修订,可能已经失效,建议先参考主要事件/任务条目
:::

**标题格式：** [条目名称] - 次要 （例如：[角色名] - 次要 或 [事件名] - 次要）  
**内容结构：**  

#### 11.1 次要人物条目

**基础信息：**  身份、信仰、在故事中扮演的角色、首次登场章节（可适当精简）  
**简述：**  对角色在故事中的行为和作用进行概括性描述，突出其次要性。  
**关联情节：**  提及与该次要人物相关的关键情节或事件，可链接到对应条目。  
**角色关系：** 简要描述与主要角色或势力之间的关联。  
**备注：**  可以是一些更轻松的吐槽或对角色命运的调侃  

#### 11.2 次要情节条目

**概述：**  简要概括次要情节的内容和性质。  
**情节简述：**  用精炼的语言描述次要情节的发生、发展和结果。  
**意义/影响：**  说明该次要情节对主线剧情或人物关系产生的潜在影响（即使影响不大）。  
**关联角色：**  提及参与该次要情节的主要或次要角色  
**备注：**  可以是对该情节的趣味性解读或一些细节补充  

## 三、标注规范
**推测内容：** 用 `据玩家社区推测...` 标注  
**免责声明：** 所有整活内容需添加类似 `本段内容为整活虚构，虚构史学家为此承担责任` 的标注  

---
*（编写时请保持队形，但不必放弃灵魂——毕竟，神也喜欢看乐子）*  
