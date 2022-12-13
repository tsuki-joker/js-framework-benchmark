import { $, appendChild, bindAttr, bindEvent, bindText, clone, select, remove as rm } from "hyplate/core";
import { For } from "hyplate/directive";
import { query, source } from "hyplate/store";
import { FunctionalComponent, Source } from "hyplate/types";
//#region common
const random = (max: number) => Math.round(Math.random() * 1000) % max;

const A = [
  "pretty",
  "large",
  "big",
  "small",
  "tall",
  "short",
  "long",
  "handsome",
  "plain",
  "quaint",
  "clean",
  "elegant",
  "easy",
  "angry",
  "crazy",
  "helpful",
  "mushy",
  "odd",
  "unsightly",
  "adorable",
  "important",
  "inexpensive",
  "cheap",
  "expensive",
  "fancy",
];
const C = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const N = [
  "table",
  "chair",
  "house",
  "bbq",
  "desk",
  "car",
  "pony",
  "cookie",
  "sandwich",
  "burger",
  "pizza",
  "mouse",
  "keyboard",
];
let nextId = 1;
interface Item {
  id: number;
  label: Source<string>;
  selected: Source<boolean>;
}
const buildData = (count: number) => {
  const data: Item[] = new Array(count);

  for (let i = 0; i < count; i++) {
    data[i] = {
      id: nextId++,
      label: source(`${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}`),
      selected: source(false),
    };
  }

  return data;
};
//#endregion

const data = source<Item[]>([]);
let lastSelected: Item | null = null;
const run = () => {
  data.set([]);
  data.set(buildData(1000));
  lastSelected = null;
};
const runLots = () => {
  data.set([]);
  data.set(buildData(10000));
  lastSelected = null;
};
const add = () => {
  data.set(data.val.concat(buildData(1000)));
};
const update = () => {
  const list = data.val;
  for (let i = 0; i < list.length; i += 10) {
    const item = list[i]!;
    item.label.set(item.label.val + " !!!");
  }
};
const clear = () => {
  data.set([]);
  lastSelected = null;
};
const swapRows = () => {
  const list = data.val.slice();
  if (list.length > 998) {
    const d1 = list[1]!;
    const d998 = list[998]!;
    list[1] = d998;
    list[998] = d1;
    data.set(list);
  }
};
bindEvent(select("button#run")!)("click", run);
bindEvent(select("button#runlots")!)("click", runLots);
bindEvent(select("button#add")!)("click", add);
bindEvent(select("button#update")!)("click", update);
bindEvent(select("button#clear")!)("click", clear);
bindEvent(select("button#swaprows")!)("click", swapRows);
const $row = $("row")!.content.firstChild as HTMLTableRowElement;
console.log($row);
const Row: FunctionalComponent<{ item: Item }> =
  ({ item }) =>
  (attach) => {
    const row = clone($row);
    const id = $(row, "id") as HTMLTableCellElement;
    const label = $(row, "label")! as HTMLAnchorElement;
    const remove = $(row, "remove")! as HTMLAnchorElement;
    id.textContent = item.id + "";
    const unbindAttr = bindAttr(
      row,
      "class",
      query(() => (item.selected.val ? "danger" : ""))
    );
    const unbindText = bindText(label, item.label);
    bindEvent(label)("click", () => {
      // Select
      lastSelected?.selected.set(false);
      item.selected.set(true);
      lastSelected = item;
    });
    bindEvent(remove)("click", () => {
      // Remove
      if (lastSelected === item) {
        lastSelected = null;
      }
      data.set(data.val.filter((inList) => item !== inList));
    });
    attach(row);
    return [
      () => {
        unbindAttr();
        unbindText();
        rm(row);
      },
      undefined,
      () => [row, row],
    ];
  };

For({ of: data, children: (item) => Row({ item }) })(appendChild(select("tbody")!));
