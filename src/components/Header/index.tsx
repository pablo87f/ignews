import React from "react";
import { SignInButton } from "../SignInButton";
import styles from "./styles.module.scss";

type MenuItemProps = {
  title: string;
  link: string;
  active?: boolean;
};

const menuOptions: MenuItemProps[] = [
  {
    title: "Home",
    link: "/",
  },
  {
    title: "Posts",
    link: "/posts",
  },
];

const MenuItem: React.FC<MenuItemProps> = ({
  link,
  title,
  active,
}: MenuItemProps) => (
  <a href={link} className={active && styles.active}>
    {title}
  </a>
);

type HeaderProps = {
  activedMenuTitle: string;
};

export function Header({ activedMenuTitle }: HeaderProps) {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <a href="/">
          <img src="/images/logo.svg" alt="ig.news" />
        </a>
        <nav>
          {menuOptions.map(({ link, title }) => (
            <MenuItem
              link={link}
              title={title}
              active={title === activedMenuTitle}
            />
          ))}
        </nav>
        <SignInButton />
      </div>
    </header>
  );
}
