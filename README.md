YesWorkflow Editor Service
==========================

This repository contains the source code for a application currently under development for viewing [YesWorkflow](https://github.com/yesworkflow-org/yw-prototypes/blob/master/README.md) (YW) visualizations of scripts in real time as the scripts are edited. The visualizations are produced by the [YW Graph Service](https://github.com/yesworkflow-org/yw-graph-service). The graphical user interface runs in any modern web browser.

A demonstration of the editor, graph service, and YesWorkflow can be found at [try.yesworkflow.org](http://try.yesworkflow.org).

Running the YW Editor Web Application
-------------------------------------
The YW editor service can be run from any computer with a Java Runtime Environment (JRE) version 1.8 or higher. The service is implemented using [Spring Boot](http://projects.spring.io/spring-boot/), and employs an embedded Tomcat application server. It is not necessary to install Tomcat or a web server of any kind.

### Install a Java Runtime Environment (JRE)

To determine the version of java installed on your computer use the -version option to the java command. For example,

    $ java -version
    java version "1.8.0_101"
    Java(TM) SE Runtime Environment (build 1.8.0_101-b13)
    Java HotSpot(TM) 64-Bit Server VM (build 25.101-b13, mixed mode)
    $

A JRE may be downloaded from Oracle's [Java SE Downloads](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) page or installed via a package manager. Install a JDK rather than the JRE if you plan to build the service from source.

### Download the Jar file for the latest release

A pre-built jar file is included in each [release](https://github.com/yesworkflow-org/yw-editor-webapp/releases) of the YW Editor package.  Download the jar file to your system.  It will be named something like `yw-editor-app-0.2.1.2.jar`.

### Run the jar file

The editor service now can be run using the `java -jar` command. For example:

    $ java -jar yw-editor-app-0.2.1.1.jar

The above command will start the YW editor service on port 8000.  Open a web browser to http://localhost:8000 to launch the editor user interface on the same computer as the service.

To run the service on a different port specify it using the `server-port` option.  For example:

    $ java -jar yw-editor-app-0.2.1.1.jar --server.port=8001

Building from source code
-------------------------

The YW editor service is implemented in Java and built using Maven.

#### JDK and Maven configuration

Before building the YW Editor service confirm that the `mvn` command is in your path, that your version of Maven is at least 3.3.9, and that a JDK version 1.8 (or higher) is found by Maven:
    
    $ mvn --version
    Apache Maven 3.3.9 (bb52d8502b132ec0a5a3f4c09453c07478323dc5; 2015-11-10T08:41:47-08:00)
    Maven home: C:\Users\tmcphill\Dropbox\Library\Java\apache-maven-3.3.9
    Java version: 1.8.0_92, vendor: Oracle Corporation
    Java home: C:\Program Files\Java\jdk1.8.0_92\jre
    Default locale: en_US, platform encoding: Cp1252
    OS name: "windows 10", version: "10.0", arch: "amd64", family: "dos"
    $

JDK 8 and Maven 3 downloads and detailed installation instructions can be found at the following links:

- [Instructions for installing and configuring JDK 1.8](http://docs.oracle.com/javase/8/docs/technotes/guides/install/install_overview.html) (Oracle Java Documentation)
- [Instructions for installing and configuring Maven 3](http://maven.apache.org/download.cgi) (Apache Maven Project)

#### Building and running with Maven

The YW Editor Service can be built and run from the command line using the following Maven commands:

Command       | Description
--------------|------------
mvn clean     | Deletes the target directory including all compiled classes.
mvn compile   | Downloads required dependencies and compiles source code in src/main/java.  Only those source files changes since the last compilation or clean are built.
mvn package   | Packages the compiled classes in target/classes and files found in src/main/resources into an executable jar file and leaves the jar in the target directory.  Compiles any changed source files as needed.
mvn spring-boot:run | Run the YW Editor Service without packaging it as a jar.  Compiles any changed source files as necessary.

Running the YW Graph Service in a different process
---------------------------------------------------
By default the YW editor service bundles the graph service in the same server process. To use the graph service running in a different process (or running on a different computer) simply start the graph and editor services separately, and provide the URL of the graph service to the editor service.

For example, to have the editor service employ the graph service instance running on port 9000 of the host myserver.mydomain.com:

1. Start the graph service (see the [YW Graph Service README](https://github.com/yesworkflow-org/yw-graph-service/blob/master/README.md) for more details) on the host myserver.mydomain.com:

    $ java -jar yw-graph-service-0.2.1.1.jar --server.port=9000

2. Start the YW editor service, specying the host and port for the graph service via the graph-service.host option:

    $ java -jar yw-editor-app-0.2.1.1.jar --graph-service.host=http://myserver.mydomain.com:9000
