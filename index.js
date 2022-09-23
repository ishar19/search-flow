#!/usr/bin/env node


import axios from 'axios';
import inquirer from 'inquirer'
import { createSpinner } from 'nanospinner'
import chalk from 'chalk'

console.log(chalk.magenta("Welcome"))

const answers={};

async function askQuestion() {
    const query = await inquirer.prompt({
        name: 'question',
        type: 'input',
        message: 'Ask your question',
        default() {
            return 'How to center a div';
        },
    });

    const question = query.question;
    return question;
}

async function searchQuestion(question){
    const spinner = createSpinner('Searching for answer...').start();
    axios(`https://api.stackexchange.com/2.3/similar?order=desc&sort=relevance&title=${question}&site=stackoverflow`)
        .then((res)=>{
            res = res.data.items
            res.forEach(data => {
                answers[data.title] = data.link
            });
            const titles = Object.keys(answers);
            // titles.forEach((title)=>{
            //     console.log('\n')
            //     console.log(chalk.bgBlack(chalk.red(title))) 
            //     console.log("=>")
            //     console.log(chalk.bgBlack(chalk.green(answers[title])))
            // })
            // spinner.success({ text: "These answers are found, click on any link to view the answer" });

            const query = inquirer.prompt({
                name: 'answers',
                type: 'list',
                message: 'Choose most relevant title from the list',
                choices:titles
            });
            const chosenAnswer = query.answers;
            console.log(chosenAnswer);
        })
        .catch((e)=>{
            spinner.error({ text: "Some unexpected stuff happened, try again" });
            console.log(e)
            process.exit(1);
        })
}
const question = await askQuestion();
searchQuestion(question);


