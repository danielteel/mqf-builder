import  Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';


export default function Documentation(){

    return <>
        <nav style={{width:'100%', display: 'flex', justifyContent:'space-evenly'}}>
            <a href="#sections">Sections</a>
            <a href="#questions">Questions</a>
            <a href="#answers">Choices</a>
            <a href="#editor-showing-where-you-messed">Editor</a>
            <a href="#example-code">Example</a>
        </nav>
        <Paper style={{flexGrow: 1, display: 'flex', flexDirection: 'column', margin:'1em', color:'#D0D0D0', overflowY:'auto'}}>
            <h2 id="overview">Overview</h2>
            <h3 id="application-title">Application Title</h3>
            <blockquote>
                An applications code should start off with its title. An exclamation point followed by text denotes what the application should be called
                <pre>!Knowledge Tester</pre>
            </blockquote>
            <h3 id="sections">Sections</h3>
            <blockquote>
                Next will come a section, which keeps questions grouped. You can have any number of sections, and each section can have any number of questions (within hardware/software constraints).
                Start a section by writing a colon and text labeling the section
                <pre>:Section Name</pre>
                Any questions under this section belong to it. If you start a new section, any questions under that section will belong to that new section.
            </blockquote>
            <h3 id="questions">Questions</h3>
            <blockquote>
                A question is composed of the questions text, an optional reference, at least 2 choices, and at least 1 correct answer identified.
            </blockquote>
            <h3 id="the-actual-question">The actual question</h3>
            <blockquote>
                To begin, just write a question
                <pre>What does 5x4-5 come out to?</pre>
                There is an edge case that requires special treatment. If a questions text will begin with a letter and a colon, the questions text should begin with ?. This prevents the parser reading the question as an answer.
                <pre>Example edge case with solution: ?A. B. C. D. what&#39;s next in this pattern?</pre>
            </blockquote>
            <h4 id="an-optional-reference">An optional reference</h4>
            <blockquote>
                Now that we have the question, we can give the test taker an optional reference, like a page number, or document
                <pre>Ref: Math book</pre>
                Or written another way
                <pre>Reference: Math book</pre>
                You don&#39;t need to include the reference line, its optional.
            </blockquote>
            <h4 id="answers">Choices</h4>
            <blockquote>
                Now that we have a question, and we included an optional reference, lets add some choices.
                <pre>
                    {`What does 5x4-5 come out to?
                    Ref: Math book
                    A. 15
                    B. -5
                    C. 20
                    D. 11`}
                </pre>
                As shown above, in alphabetical order (no skipping letters), you write a letter, a period, and then the choice text. You can have up to 26 (A-Z) possible choices, but you must have at least 2 choices (A and B).
                <em>Note: each answer needs to be on a single line of text, no line breaks allowed.</em>
            </blockquote>
            <h4 id="which-answer-is-correct-">Which answer is correct?</h4>
            <blockquote>
                We&#39;ve got the question and some choices, now lets identify which one is correct. There is 2 ways to accomplish this. The first way is to add a line under the question like so
                <pre>Ans: A</pre>
                Or written the alternative way
                <pre>Answer: A</pre>
                Using a new answer line like just shown, you can only identify one correct answer. If you want the test taker to have to select multiple items as correct choices, you simply prepend the choices themselves with an asterisk, like so
                <pre>
                    {`What is math? Select both correct answers.
                    *A. Hard
                    B. Easy
                    C. Fun
                    *D. Scary`}
                </pre>
                This method can also be used to identify one correct answer, it doesnt have to be multiple.
            </blockquote>
            <h3 id="editor-showing-where-you-messed">Editor showing where you messed up</h3>
            <blockquote>
                You may have errors in your source code, and the built in editor will periodically check your code for those errors, and if it detects them will highlight the line, or close to the line that needs to be fixed. Simply click on the error or warning at the bottom of the screen to teleport you there in the editor.
            </blockquote>
            <h3 id="formatting-and-prettifying">Formatting and prettifying</h3>
            <blockquote>
                To help keep your code clean, there is a button at the top of the code editor that looks like &quot;&lt;&gt;&quot;. Clicking this (after you&#39;ve resolved all errors), will clean your code up and format it to make it look pretty and easily read.
            </blockquote>
            <h3 id="compiling-the-html-application">Compiling the HTML Application</h3>
            <blockquote>
                After all errors have been resolved, you can finally click the wrench icon button and this will generate an HTML Application and start downloading it. If you open the resulting HTML file, you can then start taking tests! It doesnt depend on any external resources and can be used offline.
            </blockquote>
            <Typography variant='h6' id='example-code'>An example, showing the code and its generated application</Typography>
            <div>
                <img src={require('../images/examplecode.png')} alt="example code"></img>
            </div>
            <div>
                <img src={require('../images/exampleapp.png')} alt="example app"></img>
            </div>
        </Paper>
    </>

}
