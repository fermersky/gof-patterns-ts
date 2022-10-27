`
In plain words:
Template method defines the skeleton of how a certain algorithm could be performed, but defers the implementation 
of those steps to the children classes.

Wikipedia says:
In software engineering, the template method pattern is a behavioral design pattern that defines the program 
skeleton of an algorithm in an operation, deferring some steps to subclasses. It lets one redefine certain steps 
of an algorithm without changing the algorithm's structure.
`;

import * as fs from "node:fs";
import * as assert from "node:assert";
import * as path from "node:path";

interface IReportBuilderConfig {
  title: string;
  author: string;
  content: string;
  copyright: string;
}

abstract class ReportBuilder {
  protected abstract writeHead(title: string, author: string): void;
  protected abstract writeBody(content: string): void;
  protected abstract writeFooter(copyright: string): void;
  protected abstract save(): void;

  // algorithm steps are determined and cannot be changed
  export(config: IReportBuilderConfig) {
    const { title, author, content, copyright } = config;

    this.writeHead(title, author);
    this.writeBody(content);
    this.writeFooter(copyright);

    this.save();
  }
}

class MarkdownReportBuilder extends ReportBuilder {
  constructor(private writeStream: fs.WriteStream) {
    super();
    const ext = path.extname(writeStream.path.toString());

    assert.equal(ext, ".md");
  }

  protected writeHead(title: string, author: string): void {
    this.writeStream.write(`# ${title} \n\n`);
    this.writeStream.write(`## by ${author} \n\n`);
  }
  protected writeBody(content: string): void {
    this.writeStream.write(`${content} \n\n`);
  }
  protected writeFooter(copyright: string): void {
    this.writeStream.write(copyright);
  }
  protected save(): void {
    this.writeStream.emit("finish");
  }
}

class PDFReportBuilder extends ReportBuilder {
  protected writeHead(title: string, author: string): void {}
  protected writeBody(content: string): void {}
  protected writeFooter(copyright: string): void {}
  protected save(): void {}
}

const writetable = fs.createWriteStream("./report.md");
const reportConfig: IReportBuilderConfig = {
  title: "My report",
  author: "Dan Skrypnik",
  content: "Hello, World! Stonks ⬆️",
  copyright: "2022 All rights reserved",
};

const reportBuilder = new MarkdownReportBuilder(writetable);

reportBuilder.export(reportConfig);
