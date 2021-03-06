import * as _ from 'lodash';

import { ModuleWithProviders, NgModuleFactory, NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }  from '@angular/forms';
import { Route, Routes, RouterModule, Resolve, ResolveData, Data, LoadChildren } from '@angular/router';
import { HttpModule } from '@angular/http';
//import { MaterialModule } from '@angular/material';

import { BizContainerComponent } from './components/biz-container.component';
import { BizRootComponent } from './components/biz-root.component';

import { BizFraming } from './framing';

let universalModule: any;

/**
 * 
 */
export function setUniversalModule(module: any): void {
  universalModule = module;
}

/**
 * 
 */
export class BizNgModule {

  // ========================================
  // private properties
  // ========================================

  private _children: Array<any>;

  private _component: any;

  private _containers: any = {};

  private _data: any = {};

  private _framing: BizFraming<any>;

  private _ngModule: NgModule;

  private _root: boolean = false;

  private _rootComponent: any;

  private _route: Route;

  // ========================================
  // constructor
  // ========================================

  public constructor(ngModule?: NgModule) {
    this.ngModule(ngModule);
  }

  // ========================================
  // public methods
  // ========================================

  public ngModule(ngModule?: NgModule): BizNgModule {
    if (this._ngModule) {
      if (ngModule) {
        _.merge(this._ngModule, ngModule); 
      }
    } else {
      this._ngModule = ngModule || {};
    }

    return this;
  }

  /**
   * Adds to imports
   * Adds to route
   */
  public children(children: Array<any>): BizNgModule {
    this._children = children;

    return this;
  }

  /**
   * Adds to declarations
   * Adds to exports
   * Adds as component on route
   */
  public component(component: any): BizNgModule {
    this._component = component;

    return this;
  }

  /**
   * Adds containers to route data
   * Adds container components to exports and declarations
   */
  public containers(containers: any): BizNgModule {
    _.assign(this._containers, containers);

    return this;
  }

  /**
   * Method for appending data to route
   */
  public data<T>(data: T): BizNgModule {
    _.assign(this._data, data);

    return this;
  }

  /**
   * Adds BizContainerComponent to declarations and exports
   * Adds component to bootstrap
   * Defaults route to path '', pathMatch: 'full'
   */
  public root(rootComponent?: any): BizNgModule {
    this._root = true;
    this._rootComponent = rootComponent || BizRootComponent;

    return this;
  }

  /**
   * Creates Routes array with single route
   * Adds RouterModule.forRoot(routes) or RouterModule.forChild(routes) to imports
   * Adds all resolve services as providers
   */
  public route(route: Route): BizNgModule {
    if (this._route) {
      _.assign(this._route, route);
    } else {
      this._route = route;
    }

    return this;
  }

  /**
   * Calls framing.build(this)
   */
  public framing(framing: BizFraming<any>): BizNgModule {
    this._framing = framing;

    return this;
  }

  /**
   * Builds @NgModule() config in the following order:
   * - Defaults
   * - Scaffold
   * - Root
   * - Containers
   * - Component
   * - Route
   */
  public build(): NgModule {
    this.buildDefaults();
    this.buildFraming();
    this.buildRoot();        
    this.buildContainers();
    this.buildComponent();
    this.buildChildren();
    this.buildRoute();

    return this._ngModule;
  }

  // ========================================
  // private methods
  // ========================================

  private buildDefaults(): void {
    let m: NgModule = this._ngModule;

    this._data = this._data || {};
    m.imports = m.imports || [];
    m.declarations = m.declarations || [];
    m.exports = m.exports || [];
    m.providers = m.providers || [];
    m.bootstrap = m.bootstrap || [];
  }

  private buildRoot(): void {
    let m: NgModule = this._ngModule;
    let defaultRoute: any = {
      path: '',
      pathMatch: 'full'
    };

    if (this._root) {
      m.imports = m.imports.concat([
        universalModule,
        FormsModule//,
        //MaterialModule.forRoot()
      ]);

      m.declarations = m.declarations.concat([this._rootComponent]);
      m.bootstrap = m.bootstrap.concat([this._rootComponent]);

      if (this._route) {
        _.defaults(this._route, defaultRoute);
      } else {
        this._route = defaultRoute
      }
    } else {
      m.imports = m.imports.concat([
        CommonModule//,
        //MaterialModule
      ]);
    }
  }

  private buildFraming(): void {
    let m: NgModule = this._ngModule;

    if (this._framing) {
      this._framing.build(this);
    }
  }

  private buildContainers(): void {
    let m: NgModule = this._ngModule;

    if (this._containers) {
      this._data['bizContainers'] = this._containers;

      let containerComponents = Object.keys(this._containers).map((key: any) => {
        return this._containers[key];
      });

      m.exports = (m.exports || []).concat(containerComponents);
      m.declarations = (m.declarations || []).concat(containerComponents);
    }
  }

  private buildChildren(): void {
    let m: NgModule = this._ngModule;
    let r: Route = this._route;

    if (this._children) {
      m.imports = m.imports.concat(this._children);
    }
  }

  private buildRoute(): void {
    let m: NgModule = this._ngModule;
    let r: Route = this._route;

    if (r) {
      let newRoute: Route = {
        data: {}
      };
      
      if (r.path || r.path == "") newRoute.path = r.path;
      if (r.pathMatch) newRoute.pathMatch = r.pathMatch;
      if (r.component) newRoute.component = r.component;
      if (r.outlet) newRoute.outlet = r.outlet;
      if (r.canActivate) newRoute.canActivate = r.canActivate;
      if (r.canActivateChild) newRoute.canActivateChild = r.canActivateChild;
      if (r.canDeactivate) newRoute.canDeactivate = r.canDeactivate;
      if (r.canLoad) newRoute.canLoad = r.canLoad;
      if (r.data) _.assign(newRoute.data, r.data);
      if (this._data) _.assign(newRoute.data, this._data);
      if (r.resolve) newRoute.resolve = r.resolve;
      if (r.children) newRoute.children = r.children;
      if (r.loadChildren) newRoute.loadChildren = r.loadChildren;
      if (r.redirectTo) newRoute.redirectTo = r.redirectTo;

      if (newRoute.outlet) {
        delete newRoute['redirectTo'];
      }

      if (newRoute.redirectTo) {
        delete newRoute['component'];
      }

      let routes: Routes = [newRoute];
      let routingProviders: any[] = newRoute.resolve ? Object.keys(newRoute.resolve).map((k) => {
        return newRoute.resolve[k]
      }) : [];
      let routing: ModuleWithProviders = this._root ? RouterModule.forRoot(routes) : RouterModule.forChild(routes);

      m.imports = m.imports.concat([routing]);
      m.providers = m.providers.concat([routingProviders]);
    }
  }

  private buildComponent(): void {
    let m: NgModule = this._ngModule;

    if (this._component) {
      m.declarations = m.declarations.concat([this._component]);

      if (this._route) {
        this._route.component = this._component;
      }
    }
  }
}