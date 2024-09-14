import { ImageList, ImageListItem, Paper, Typography } from '@mui/material'


export default function Documentation(){

    return ( 
        <div style={{flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems:'center'}}>

            <Paper sx={{padding:'10px'}} elevation={4}>
                <h2 id="overview">Overview</h2>
                <h3 id="application-title">Application Title</h3>
                <blockquote>
                <p>An applications code should start off with its title. An exclamation point followed by text denotes what the application should be called</p>
                <pre><code><span>!Knowledge Tester</span>
                </code></pre></blockquote>
                <h3 id="sections">Sections</h3>
                <blockquote>
                <p>Next will come a section, which keeps questions grouped. You can have any number of sections, and each section can have any number of questions (within hardware/software constraints).</p>
                <p>Start a section by writing a colon and text labeling the section</p>
                <pre><code>:<span><span>Section</span> Name</span>
                </code></pre><p>Any questions under this section belong to it. If you start a new section, any questions under that section will belong to that new section.</p>
                </blockquote>
                <h3 id="questions">Questions</h3>
                <blockquote>
                <p>A question is composed of the questions text, an optional reference, at least 2 choices, and at least 1 correct answer identified.</p>
                <h4 id="the-actual-question">The actual question</h4>
                <p>To begin, just write a question</p>
                <pre><code>What <span>does</span> <span>5</span>x4<span>-5</span> come out <span>to</span>?
                </code></pre><h5 id="edge-case-question-starts-with-a-letter-and-a-period-">Edge case: Question starts with a letter and a period.</h5>
                <p>If a questions text will begin with a letter and a colon, the questions text should begin with ?. This prevents the parser reading the question as an answer.</p>
                <blockquote>
                <p>Example: ?A. B. C. D. what&#39;s next in this pattern?</p>
                </blockquote>
                </blockquote>
                <h4 id="an-optional-reference">An optional reference</h4>
                <blockquote>
                <p>Now that we have the question, we can give the test taker an optional reference, like a page number, or document</p>
                <pre><code><span >Ref:</span> Math book
                </code></pre><p>Or written another way</p>
                <pre><code><span>Reference:</span> Math book
                </code></pre><p>You don&#39;t need to include the reference line, its optional.</p>
                </blockquote>
                <h4 id="answers">Choices</h4>
                <blockquote>
                <p>Now that we have a question, and we included an optional reference, lets add some choices.</p>
                <pre><code>What <span>does</span> <span>5</span>x4<span>-5</span> come out <span>to</span>?<br/>
                Ref: Math book<br/>
                A. <span>15</span><br/>
                B. <span>-5</span><br/>
                C. <span>20</span><br/>
                D. <span>11</span><br/>
                </code></pre><p>As shown above, in alphabetical order (no skipping letters), you write a letter, a period, and then the answers text. You can have up to 26 (A-Z) possible choices, but you must have at least 2 choices (A and B). </p>
                <p><em>Note: each answer needs to be on a single line of text, no line breaks allowed.</em></p>
                </blockquote>
                <h4 id="which-answer-is-correct-">Which answer is correct?</h4>
                <blockquote>
                <p>We&#39;ve got the question and some choices, now lets identify which one is correct. There is 2 ways to accomplish this. The first way is to add a line under the question like so</p>
                <pre><code><span >Ans:</span> A
                </code></pre><p>Or written the alternative way</p>
                <pre><code><span>Answer:</span> A
                </code></pre><p>Using a new answer line like just shown, you can only identify one correct answer. If you want the test taker to have to select multiple items as correct choices, you simply prepend the choices themselves with an asterisk, like so</p>
                <pre><code><span>What</span> is math? <span>Select </span><span>both </span>correct answers.<br/>
                *A. Hard<br/>
                <span>B. </span>Easy<br/>
                <span>C.</span> Fun<br/>
                *D. Scary<br/>
                </code></pre><p>This method can also be used to identify one correct answer, it doesnt have to be multiple.</p>
                </blockquote>
                <h3 id="editor-showing-where-you-messed">Editor showing where you messed</h3>
                <blockquote>
                <p>You may have errors in your source code, and the built in editor will periodically check your code for those errors, and if it detects them will highlight the line, or close to the line that needs to be fixed. Simply click on the error or warning at the bottom of the screen to teleport you there in the editor.</p>
                </blockquote>
                <h3 id="formatting-and-prettifying">Formatting and prettifying</h3>
                <blockquote>
                <p>To help keep your code clean, there is a button at the top of the code editor that looks like &quot;&lt;&gt;&quot;. Clicking this (after you&#39;ve resolved all errors), will clean your code up and format it to make it look pretty and easily read.</p>
                </blockquote>
                <h3 id="compiling-the-html-application">Compiling the HTML Application</h3>
                <blockquote>
                <p>After all errors have been resolved, you can finally click the wrench icon button and this will generate an HTML Application and start downloading it. If you open the resulting HTML file, you can then start taking tests! It doesnt depend on any external resources and can be used offline.</p>
                </blockquote>

                <Typography variant='h6'>An example, showing the code and its generated application</Typography>

                <div>
                    <img src={require('../images/examplecode.png')} alt="example"></img>
                </div>
                <div>
                    <img src={require('../images/exampleapp.png')} alt="example"></img>
                </div>
            </Paper>            
        </div>
    );

}

/*Working copy
## Overview
### Application Title
>Generally, an applications code should start off with its title. An exclamation point followed by text denotes what the application should be called
```
!Knowledge Tester
```

### Sections
>Next will come a section, which keeps questions grouped. You can have any number of sections, and each section can have any number of questions (within hardware/software constraints).

>Start a section by writing a colon and text labeling the section
```
:Section Name
```
Any questions under this section belong to it. If you start a new section, any questions under that section will belong to that new section.

### Questions
>A question is composed of the questions text, an optional reference, at least 2 answer choices, and at least 1 correct answer identified.
#### The actual question
To begin, just write a question
```
What does 5x4-5 come out to?
```
##### Edge case: Question starts with a letter and a period.
>If a questions text will begin with a letter and a colon, the questions text should begin with ?. This prevents the parser reading the question as an answer.
>>Example: ?A. B. C. D. what's next in this pattern?

#### An optional reference
>Now that we have the question, we can give the test taker an optional reference, like a page number, or document
```
Ref: Math book
```
Or written another way
```
Reference: Math book
```
You don't need to include the reference line, its optional.


#### Answers
>Now that we have a question, and we included an optional reference, lets add some answer choices.
```
What does 5x4-5 come out to?
Ref: Math book
A. 15
B. -5
C. 20
D. 11
```
As shown above, in alphabetical order (no skipping letters), you write a letter, a period, and then the answers text. You can have up to 26 (A-Z) possible choices, but you must have at least 2 choices (A and B). 

>*Note: each answer needs to be on a single line of text, no line breaks allowed.*

#### Which answer is correct?
>We've got the question, some answer choices, now lets identify which one is correct. There is 2 ways to accomplish this. The first way is to add a line under the question like so
```
Ans: A
```
Or written the alternative way
```
Answer: A
```
Using a new answer line like just shown, you can only identify one correct answer. If you want the test taker to have to select multiple items as correct choices, you simply prepend the answer choices themselves with an asterisk, like so
```
What is math? Select both correct answers.
*A. Hard
B. Easy
C. Fun
*D. Scary
```
This method can also be used to identify one correct answer, it doesnt have to be multiple.

### Editor showing where you messed
>You may have errors in your source code, and the built in editor will periodically check your code for those errors, and if it detects them will highlight the line, or close to the line that needs to be fixed. Simply click on the error or warning at the bottom of the screen to teleport you there in the editor.

### Formatting and prettifying
>To help keep your code clean, there is a button at the top of the code editor that looks like "<>". Clicking this (after you've resolved all errors), will clean your code up and format it to make it look pretty and easily read.

### Compiling the HTML Application
>After all errors have been resolved, you can finally click the wrench icon button and this will generate an HTML Application and start downloading it. If you open the resulting HTML file, you can then start taking tests! It doesnt depend on any external resources and can be used offline.

*/