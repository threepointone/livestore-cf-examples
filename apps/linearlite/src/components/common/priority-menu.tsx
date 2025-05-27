import { Shortcut } from "@/components/common/shortcut";
import { Icon, IconName } from "@/components/icons";
import { priorityOptions } from "@/data/priority-options";
import { Priority } from "@/types/priority";
import { CheckIcon } from "@heroicons/react/16/solid";
import React from "react";
import { useKeyboard } from "react-aria";
import {
  Button,
  Menu,
  MenuItem,
  MenuTrigger,
  Popover
} from "react-aria-components";

export const PriorityMenu = ({
  priority,
  onPriorityChange,
  showLabel = false
}: {
  priority: Priority;
  onPriorityChange: (priority: Priority) => void;
  showLabel?: boolean;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const { keyboardProps } = useKeyboard({
    onKeyDown: (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        return;
      }
      priorityOptions.forEach(({ shortcut }, priorityOption) => {
        if (e.key === shortcut) {
          onPriorityChange(priorityOption as Priority);
          setIsOpen(false);
          return;
        }
      });
    }
  });

  return (
    <MenuTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
      <Button
        aria-label="Select priority"
        className="group h-8 min-w-8 rounded-lg flex gap-1.5 px-2 items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus:bg-neutral-100 dark:focus:bg-neutral-800"
      >
        <Icon
          name={priorityOptions[priority]!.icon as IconName}
          className={`size-3.5 ${priority === 4 ? "text-red-400 group-hover:text-red-600 dark:group-hover:text-red-300" : priorityOptions[priority]!.style}`}
        />
        {showLabel && <span>{priorityOptions[priority]!.name}</span>}
      </Button>
      <Popover
        offset={0}
        className="w-48 ml-1 p-2 bg-white rounded-lg shadow-md border border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700 text-sm leading-none"
      >
        <Menu className="focus:outline-none" {...keyboardProps}>
          {priorityOptions.map(
            ({ name, icon, style, shortcut }, priorityOption) => (
              <MenuItem
                key={priorityOption}
                onAction={() => onPriorityChange(priorityOption as Priority)}
                className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus:bg-neutral-100 dark:focus:bg-neutral-700 cursor-pointer flex items-center gap-2"
              >
                <Icon name={icon as IconName} className={`size-3.5 ${style}`} />
                <span>{name}</span>
                {priorityOption === priority && (
                  <CheckIcon className="size-4 absolute right-9" />
                )}
                <Shortcut keys={[shortcut]} className="absolute right-3" />
              </MenuItem>
            )
          )}
        </Menu>
      </Popover>
    </MenuTrigger>
  );
};
