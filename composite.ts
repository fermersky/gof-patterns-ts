`
In plain words:
Composite pattern lets clients treat the individual objects in a uniform manner.

Wikipedia says:
In software engineering, the composite pattern is a partitioning design pattern. The composite pattern describes 
that a group of objects is to be treated in the same way as a single instance of an object. The intent of a composite 
is to "compose" objects into tree structures to represent part-whole hierarchies. Implementing the composite pattern 
lets clients treat individual objects and compositions uniformly.
`;
import { EventEmitter } from "node:events";

type EventCallback = (event: object) => void;

abstract class DOMNode {
  private emitter: EventEmitter;
  //   private emitter: symbol = Symbol('emitter')

  constructor(private tag: string) {
    this.emitter = new EventEmitter();
  }

  on(event: string, fn: EventCallback) {
    this.emitter.on(event, fn);
  }
  emit(event: string): void {
    this.emitter.emit(event, { event, target: this });

    this.notify_children(event, this.children);
  }

  render(depth: number = 0): void {
    console.log(`${this.get_offset(depth)}${this.tag}`);

    for (const node of this.children || []) {
      node.render(depth + 1);
    }
  }

  private get_offset(depth: number) {
    if (depth === 0) {
      return "";
    }
    return new Array(depth).fill("-").join("").concat(" ");
  }

  private notify_children(event: string, nodes?: DOMNode[]) {
    if (nodes) {
      for (const node of nodes) {
        node.emit(event);
      }
    }
  }

  children?: DOMNode[];
}

class Image extends DOMNode {
  constructor(public src: string, public alt: string) {
    super("img");
  }
}

class DivContainer extends DOMNode {
  constructor(children?: DOMNode[], innerText?: string) {
    super("div");

    this.children = children;
  }
}

const image1 = new Image("https://example.org?img_name=1.png", "first_image");
const image2 = new Image("https://example.org?img_name=2.png", "second_image");
const image3 = new Image("https://example.org?img_name=3.png", "third_image");

for (const image of [image1, image2, image3]) {
  image.on("click", (e) => {
    console.log("callbacked was called");
  });
}

const image4 = new Image("https://example.org?img_name=4.png", "fourth_image");
image4.on("click", (e) => {
  console.log(e);
  console.log("image4 click callback was called");
});

const child_container = new DivContainer([image4]);

const container = new DivContainer([image1, image2, image3, child_container], "inner_text");
container.on("click", (e) => {
  console.log("container callback was called");
});

container.emit("click"); // emits "click" event on itself and on all child nodes recursively

container.render();
